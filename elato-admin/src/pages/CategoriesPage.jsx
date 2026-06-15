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
import { useCategories, useCategoryMutations } from "../hooks/useCategories";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Toggle from "../components/ui/Toggle";
import ImageUpload from "../components/ui/ImageUpload";
import DragHandle from "../components/ui/DragHandle";

const EMPTY = { name: "", description: "", image_url: "", is_active: true };

function SortableCategoryRow({ cat, onEdit, onDelete, isMobile }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: cat.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  if (isMobile) {
    return (
      <div ref={setNodeRef} style={{
        ...style,
        background: "#FBF5E8",
        border: "1px solid rgba(90,55,10,0.12)",
        borderRadius: "4px",
        padding: "12px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}>
        <DragHandle listeners={listeners} attributes={attributes} />

        {cat.image_url ? (
          <img src={cat.image_url} alt={cat.name}
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
            {cat.name}
          </p>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.62rem", fontWeight: 500,
            color: cat.is_active ? "#2D7A1F" : "#8B2500",
            background: cat.is_active ? "rgba(45,122,31,0.08)" : "rgba(139,37,0,0.08)",
            padding: "1px 7px", borderRadius: "2px",
            display: "inline-block", marginTop: "2px",
          }}>
            {cat.is_active ? "Active" : "Hidden"}
          </span>
        </div>

        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          <Button variant="secondary" size="sm" onClick={() => onEdit(cat)}>Edit</Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(cat.id)}>Del</Button>
        </div>
      </div>
    );
  }

  // Desktop row
  return (
    <tr ref={setNodeRef} style={{ ...style, borderBottom: "1px solid rgba(90,55,10,0.07)" }}>
      <td style={{ padding: "11px 14px", width: "36px" }}>
        <DragHandle listeners={listeners} attributes={attributes} />
      </td>
      <td style={{ padding: "11px 14px" }}>
        {cat.image_url ? (
          <img src={cat.image_url} alt={cat.name}
            style={{ width: "52px", height: "38px", objectFit: "cover", borderRadius: "3px" }} />
        ) : (
          <div style={{ width: "52px", height: "38px", background: "rgba(90,55,10,0.08)", borderRadius: "3px" }} />
        )}
      </td>
      <td style={{ padding: "11px 14px" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 500, color: "#1A0E00" }}>
          {cat.name}
        </p>
        {cat.description && (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "#9E7519", marginTop: "2px" }}>
            {cat.description}
          </p>
        )}
      </td>
      <td style={{ padding: "11px 14px" }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: 500,
          color: cat.is_active ? "#2D7A1F" : "#8B2500",
          background: cat.is_active ? "rgba(45,122,31,0.08)" : "rgba(139,37,0,0.08)",
          padding: "3px 10px", borderRadius: "2px",
        }}>
          {cat.is_active ? "Active" : "Hidden"}
        </span>
      </td>
      <td style={{ padding: "11px 14px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button variant="secondary" size="sm" onClick={() => onEdit(cat)}>Edit</Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(cat.id)}>Delete</Button>
        </div>
      </td>
    </tr>
  );
}

export default function CategoriesPage() {
  const isMobile = useIsMobile();
  const { data: categories, isLoading } = useCategories();
  const { create, update, remove, reorder } = useCategoryMutations();
  const [localItems, setLocalItems] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const displayed = localItems ?? categories ?? [];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e?.target ? e.target.value : e }));

  const openCreate = () => { setForm(EMPTY); setModal("create"); };
  const openEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || "", image_url: cat.image_url || "", is_active: cat.is_active });
    setEditId(cat.id);
    setModal("edit");
  };
  const closeModal = () => { setModal(null); setEditId(null); };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    if (modal === "create") await create.mutateAsync(form);
    else await update.mutateAsync({ id: editId, data: form });
    setLocalItems(null);
    closeModal();
  };

  const handleDelete = async () => {
    await remove.mutateAsync(deleteId);
    setLocalItems(null);
    setDeleteId(null);
  };

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = displayed.findIndex((c) => c.id === active.id);
    const newIndex = displayed.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(displayed, oldIndex, newIndex);
    setLocalItems(reordered);
    await reorder.mutateAsync(reordered.map((c, i) => ({ id: c.id, sort_order: i })));
  };

  return (
    <div style={{ padding: isMobile ? "20px 14px" : "36px 32px" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", marginBottom: "20px",
        gap: "12px", flexWrap: "wrap",
      }}>
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.22em", color: "#9E7519", textTransform: "uppercase", marginBottom: "4px" }}>
            Menu Management
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: isMobile ? "1.6rem" : "2rem", fontWeight: 500, color: "#1A0E00" }}>
            Categories
          </h1>
        </div>
        <Button onClick={openCreate}>+ New</Button>
      </div>

      {displayed.length > 1 && (
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", color: "#9E7519", marginBottom: "12px" }}>
          ↕ Drag to reorder
        </p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={displayed.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {isLoading ? (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#9E7519" }}>Loading…</p>
            </div>
          ) : isMobile ? (
            /* Mobile: card stack */
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {displayed.map((cat) => (
                <SortableCategoryRow key={cat.id} cat={cat} onEdit={openEdit} onDelete={setDeleteId} isMobile={true} />
              ))}
            </div>
          ) : (
            /* Desktop: table */
            <div style={{ background: "#FBF5E8", borderRadius: "4px", border: "1px solid rgba(90,55,10,0.1)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(90,55,10,0.12)" }}>
                    {["", "Image", "Name", "Status", "Actions"].map((h) => (
                      <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9E7519" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((cat) => (
                    <SortableCategoryRow key={cat.id} cat={cat} onEdit={openEdit} onDelete={setDeleteId} isMobile={false} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SortableContext>
      </DndContext>

      {/* Create/Edit Modal */}
      <Modal isOpen={modal === "create" || modal === "edit"} onClose={closeModal}
        title={modal === "create" ? "New Category" : "Edit Category"}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Input label="Name" name="name" value={form.name} onChange={set("name")} required />
          <Input label="Description" name="description" value={form.description} onChange={set("description")} rows={2} />
          <ImageUpload label="Category Image" value={form.image_url}
            onChange={(url) => setForm((f) => ({ ...f, image_url: url }))} folder="categories" />
          <Toggle label="Active (visible to customers)" checked={form.is_active}
            onChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", paddingTop: "4px" }}>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleSave} disabled={create.isPending || update.isPending}>
              {create.isPending || update.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Category">
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#3D2200", marginBottom: "20px", lineHeight: 1.65 }}>
          This permanently deletes the category and all its items. Cannot be undone.
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} disabled={remove.isPending}>
            {remove.isPending ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}