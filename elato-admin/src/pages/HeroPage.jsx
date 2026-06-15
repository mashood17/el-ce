import { useState } from "react";
import {
  DndContext, closestCenter, PointerSensor, TouchSensor,
  useSensor, useSensors,
} from "@dnd-kit/core";
import {
  SortableContext, rectSortingStrategy,
  useSortable, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/heroSlides";
import { uploadImage } from "../api/upload";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import DragHandle from "../components/ui/DragHandle";

function SortableSlide({ slide, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: slide.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        background: "#FBF5E8",
        borderRadius: "4px",
        overflow: "hidden",
        border: "1px solid rgba(90,55,10,0.1)",
      }}
    >
      <img
        src={slide.image_url}
        alt="Hero"
        style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }}
      />
      <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <DragHandle listeners={listeners} attributes={attributes} />
        <Button variant="danger" size="sm" onClick={() => onDelete(slide.id)}>Remove</Button>
      </div>
    </div>
  );
}

export default function HeroPage() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["hero"] });
  const [localSlides, setLocalSlides] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: fetchedSlides, isLoading } = useQuery({
    queryKey: ["hero"],
    queryFn: async () => { const { data } = await api.getHeroSlides(); return data; },
  });

  const deleteMutation = useMutation({ mutationFn: api.deleteSlide, onSuccess: () => { invalidate(); setLocalSlides(null); } });

  const displayed = localSlides ?? fetchedSlides ?? [];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "hero");
      await api.addSlide(url);
      invalidate();
      setLocalSlides(null);
    } catch { alert("Upload failed."); }
    finally { setUploading(false); e.target.value = ""; }
  };

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = displayed.findIndex((s) => s.id === active.id);
    const newIndex = displayed.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(displayed, oldIndex, newIndex);
    setLocalSlides(reordered);
    await api.reorderSlides(reordered.map((s, i) => ({ id: s.id, sort_order: i })));
  };

  return (
    <div style={{ padding: "clamp(20px, 4vw, 40px) clamp(16px, 4vw, 36px)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "24px", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.22em", color: "#9E7519", textTransform: "uppercase", marginBottom: "4px" }}>
            Hero Section
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.6rem, 4vw, 2rem)", fontWeight: 500, color: "#1A0E00" }}>
            Hero Slides
          </h1>
        </div>
        <label style={{ cursor: uploading ? "wait" : "pointer" }}>
          <input type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={handleUpload} disabled={uploading} />
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 500,
            background: "#9E7519", color: "#FAF0DC",
            padding: "9px 20px", borderRadius: "3px", cursor: "pointer",
            letterSpacing: "0.04em",
          }}>
            {uploading ? "Uploading…" : "+ Add Slide"}
          </span>
        </label>
      </div>

      {displayed.length > 1 && (
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "#9E7519", marginBottom: "14px" }}>
          Drag slides to reorder
        </p>
      )}

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "48px" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#9E7519" }}>Loading…</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={displayed.map((s) => s.id)} strategy={rectSortingStrategy}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "14px" }}>
              {displayed.map((slide) => (
                <SortableSlide key={slide.id} slide={slide} onDelete={setDeleteId} />
              ))}
              {displayed.length === 0 && (
                <div style={{ gridColumn: "1/-1", padding: "48px", textAlign: "center", background: "#FBF5E8", borderRadius: "4px", border: "1px solid rgba(90,55,10,0.1)" }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.1rem", color: "#9E7519" }}>
                    No slides yet. Upload your first hero image.
                  </p>
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Remove Slide" width="400px">
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#3D2200", marginBottom: "20px", lineHeight: 1.65 }}>
          This will permanently remove this hero slide.
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger"
            onClick={async () => { await deleteMutation.mutateAsync(deleteId); setDeleteId(null); }}
            disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? "Removing…" : "Remove"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}