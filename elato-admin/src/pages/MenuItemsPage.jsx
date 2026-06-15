import { useState } from "react";
import {
  DndContext, closestCenter, PointerSensor, TouchSensor,
  useSensor, useSensors,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useIsMobile } from "../hooks/useWindowSize";
import { useCategories } from "../hooks/useCategories";
import { useMenuItems, useMenuItemMutations } from "../hooks/useMenuItems";
import { reorderItems } from "../api/menuItems";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Toggle from "../components/ui/Toggle";
import ImageUpload from "../components/ui/ImageUpload";
import DragHandle from "../components/ui/DragHandle";

const EMPTY = { name: "", description: "", price: "", image_url: "", is_veg: true, is_active: true, category_id: "" };

function SortableItemRow({ item, onEdit, onDelete, isMobile }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.35 : 1 };

  if (isMobile) {
    return (
      <div ref={setNodeRef} style={{
        ...style,
        background: "#FBF5E8", border: "1px solid rgba(90,55,10,0.12)",
        borderRadius: "4px", padding: "12px",
        display: "flex", alignItems: "center", gap: "10px",
      }}>
        <DragHandle listeners={listeners} attributes={attributes} />
        {item.image_url ? (
          <img src={item.image_url} alt={item.name}
            style={{ width: "44px", height: "34px", objectFit: "cover", borderRadius: "3px", flexShrink: 0 }} />
        ) : (
          <div style={{ width: "44px", height: "34px", background: "rgba(90,55,10,0.08)", borderRadius: "3px", flexShrink: 0 }} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "0.95rem", fontWeight: 500, color: "#1A0E00",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {item.name}
          </p>
          <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "2px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 500, color: "#6B3E00" }}>
              ₹{item.price}
            </span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.62rem", color: item.is_veg ? "#2D7A1F" : "#8B2500" }}>
              {item.is_veg ? "Veg" : "Non-Veg"}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          <Button variant="secondary" size="sm" onClick={() => onEdit(item)}>Edit</Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(item)}>Del</Button>
        </div>
      </div>
    );
  }

  return (
    <tr ref={setNodeRef} style={{ ...style, borderBottom: "1px solid rgba(90,55,10,0.07)" }}>
      <td style={{ padding: "11px 14px", width: "36px" }}>
        <DragHandle listeners={listeners} attributes={attributes} />
      </td>
      <td style={{ padding: "11px 14px" }}>
        {item.image_url ? (
          <img src={item.image_url} alt={item.name}
            style={{ width: "52px", height: "38px", objectFit: "cover", borderRadius: "3px" }} />
        ) : (
          <div style={{ width: "52px", height: "38px", background: "rgba(90,55,10,0.08)", borderRadius: "3px" }} />
        )}
      </td>
      <td style={{ padding: "11px 14px" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.98rem", fontWeight: 500, color: "#1A0E00" }}>
          {item.name}
        </p>
        {item.description && (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", color: "#9E7519", marginTop: "1px" }}>
            {item.description}
          </p>
        )}
      </td>
      <td style={{ padding: "11px 14px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", fontWeight: 500, color: "#6B3E00" }}>
        ₹{item.price}
      </td>
      <td style={{ padding: "11px 14px" }}>
        <span style={{ fontSize: "0.65rem", fontWeight: 500, fontFamily: "'DM Sans', sans-serif", color: item.is_veg ? "#2D7A1F" : "#8B2500" }}>
          {item.is_veg ? "Veg" : "Non-Veg"}
        </span>
      </td>
      <td style={{ padding: "11px 14px" }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: 500,
          color: item.is_active ? "#2D7A1F" : "#8B2500",
          background: item.is_active ? "rgba(45,122,31,0.08)" : "rgba(139,37,0,0.08)",
          padding: "3px 10px", borderRadius: "2px",
        }}>
          {item.is_active ? "Active" : "Hidden"}
        </span>
      </td>
      <td style={{ padding: "11px 14px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button variant="secondary" size="sm" onClick={() => onEdit(item)}>Edit</Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(item)}>Delete</Button>
        </div>
      </td>
    </tr>
  );
}

export default function MenuItemsPage() {
  const isMobile = useIsMobile();
  const { data: categories } = useCategories();
  const [selectedCat, setSelectedCat] = useState("");
  const { data: fetchedItems, isLoading } = useMenuItems(selectedCat);
  const { create, update, remove } = useMenuItemMutations();
  const [localItems, setLocalItems] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const displayed = localItems ?? fetchedItems ?? [];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e?.target ? e.target.value : e }));

  const openCreate = () => { setForm({ ...EMPTY, category_id: selectedCat }); setModal("create"); };
  const openEdit = (item) => {
    setForm({
      name: item.name, description: item.description || "",
      price: item.price, image_url: item.image_url || "",
      is_veg: item.is_veg, is_active: item.is_active, category_id: item.category_id,
    });
    setEditId(item.id);
    setModal("edit");
  };
  const closeModal = () => { setModal(null); setEditId(null); };

  const handleSave = async () => {
    const price = parseFloat(form.price);
    if (!form.name.trim() || isNaN(price) || price < 0 || !form.category_id) return;
    const payload = { ...form, price };
    if (modal === "create") await create.mutateAsync(payload);
    else await update.mutateAsync({ id: editId, data: payload });
    setLocalItems(null);
    closeModal();
  };

  const handleDelete = async () => {
    await remove.mutateAsync({ id: deleteTarget.id, category_id: deleteTarget.category_id });
    setLocalItems(null);
    setDeleteTarget(null);
  };

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = displayed.findIndex((i) => i.id === active.id);
    const newIndex = displayed.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(displayed, oldIndex, newIndex);
    setLocalItems(reordered);
    await reorderItems(reordered.map((i, idx) => ({ id: i.id, sort_order: idx })));
  };

  return (
    <div style={{ padding: isMobile ? "20px 14px" : "36px 32px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "18px", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.22em", color: "#9E7519", textTransform: "uppercase", marginBottom: "4px" }}>
            Menu Management
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: isMobile ? "1.6rem" : "2rem", fontWeight: 500, color: "#1A0E00" }}>
            Menu Items
          </h1>
        </div>
        <Button onClick={openCreate} disabled={!selectedCat}>+ New Item</Button>
      </div>

      {/* Category tabs — scrollable on mobile */}
      <div style={{ display: "flex", gap: "7px", flexWrap: "nowrap", overflowX: "auto", marginBottom: "18px", paddingBottom: "4px", WebkitOverflowScrolling: "touch" }}>
        {categories?.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCat(cat.id); setLocalItems(null); }}
            style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem",
              fontWeight: selectedCat === cat.id ? 500 : 400,
              padding: "7px 14px", borderRadius: "3px", border: "1px solid",
              borderColor: selectedCat === cat.id ? "#9E7519" : "rgba(90,55,10,0.2)",
              background: selectedCat === cat.id ? "#9E7519" : "transparent",
              color: selectedCat === cat.id ? "#FAF0DC" : "#6B4A18",
              cursor: "pointer", transition: "all 0.2s ease",
              whiteSpace: "nowrap", flexShrink: 0,
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {!selectedCat ? (
        <div style={{ padding: "40px 20px", textAlign: "center", background: "#FBF5E8", borderRadius: "4px", border: "1px solid rgba(90,55,10,0.1)" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.05rem", color: "#9E7519" }}>
            Select a category above
          </p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={displayed.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            {isLoading ? (
              <div style={{ padding: "40px", textAlign: "center" }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#9E7519" }}>Loading…</p>
              </div>
            ) : isMobile ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {displayed.map((item) => (
                  <SortableItemRow key={item.id} item={item} onEdit={openEdit} onDelete={setDeleteTarget} isMobile={true} />
                ))}
              </div>
            ) : (
              <div style={{ background: "#FBF5E8", borderRadius: "4px", border: "1px solid rgba(90,55,10,0.1)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(90,55,10,0.12)" }}>
                      {["", "Image", "Name", "Price", "Type", "Status", "Actions"].map((h) => (
                        <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9E7519" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.map((item) => (
                      <SortableItemRow key={item.id} item={item} onEdit={openEdit} onDelete={setDeleteTarget} isMobile={false} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SortableContext>
        </DndContext>
      )}

      {/* Modals */}
      <Modal isOpen={modal === "create" || modal === "edit"} onClose={closeModal}
        title={modal === "create" ? "New Menu Item" : "Edit Menu Item"}>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6B4A18" }}>
              Category *
            </label>
            <select
              value={form.category_id}
              onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#1A0E00", background: "#FBF5E8", border: "1px solid rgba(90,55,10,0.2)", borderRadius: "3px", padding: "10px 12px", outline: "none", width: "100%" }}
            >
              <option value="">Select category</option>
              {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <Input label="Item Name" name="name" value={form.name} onChange={set("name")} required />
          <Input label="Description" name="description" value={form.description} onChange={set("description")} rows={2} />
          <Input label="Price (₹)" name="price" type="number" value={form.price} onChange={set("price")} min={0} required />
          <ImageUpload label="Item Image" value={form.image_url}
            onChange={(url) => setForm((f) => ({ ...f, image_url: url }))} folder="items" />
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <Toggle label="Vegetarian" checked={form.is_veg} onChange={(v) => setForm((f) => ({ ...f, is_veg: v }))} />
            <Toggle label="Active" checked={form.is_active} onChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", paddingTop: "4px" }}>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleSave} disabled={create.isPending || update.isPending}>
              {create.isPending || update.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Item">
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#3D2200", marginBottom: "20px", lineHeight: 1.65 }}>
          This permanently deletes this menu item. Cannot be undone.
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} disabled={remove.isPending}>
            {remove.isPending ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}