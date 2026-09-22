// Fixed red crisis bar, pinned to the bottom of every screen with no exceptions.
export default function CrisisBar() {
  return (
    <div className="crisis-bar" role="complementary" aria-label="Crisis support">
      <span>Need to talk to someone? Call</span>
      <a href="tel:988">988</a>
      <span>or</span>
      <a href="tel:211">211</a>
    </div>
  )
}
