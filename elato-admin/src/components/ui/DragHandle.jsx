export default function DragHandle({ listeners, attributes }) {
  return (
    <div
      {...listeners}
      {...attributes}
      style={{
        cursor: "grab",
        color: "rgba(90,55,10,0.3)",
        padding: "4px 6px",
        display: "flex",
        alignItems: "center",
        touchAction: "none",
        flexShrink: 0,
      }}
      title="Drag to reorder"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="9" cy="6" r="1" fill="currentColor"/>
        <circle cx="15" cy="6" r="1" fill="currentColor"/>
        <circle cx="9" cy="12" r="1" fill="currentColor"/>
        <circle cx="15" cy="12" r="1" fill="currentColor"/>
        <circle cx="9" cy="18" r="1" fill="currentColor"/>
        <circle cx="15" cy="18" r="1" fill="currentColor"/>
      </svg>
    </div>
  );
}