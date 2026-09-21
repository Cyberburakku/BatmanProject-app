// Final thumbnails are out of scope for the demo, so every video card
// shows this labelled box instead.
export default function ImagePlaceholder({ height = 120 }) {
  return (
    <div className="image-box" style={{ minHeight: height }} aria-hidden="true">
      Image Coming Soon
    </div>
  )
}
