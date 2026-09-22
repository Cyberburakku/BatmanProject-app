import { useEffect, useRef, useState } from 'react'
import Icon from '../components/Icon'
import { certificateFilename, drawCertificate } from '../lib/certificate'

export default function CertificateScreen({ name, moduleTitle, issuedOn, back }) {
  const canvasRef = useRef(null)
  const [downloadUrl, setDownloadUrl] = useState('')

  const dateText = new Date(issuedOn || Date.now()).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawCertificate(canvas, { name, moduleTitle, dateText })
    try {
      setDownloadUrl(canvas.toDataURL('image/png'))
    } catch (err) {
      console.warn('Could not prepare the certificate download.', err)
    }
  }, [name, moduleTitle, dateText])

  return (
    <div className="screen">
      <div className="row">
        <button type="button" className="btn btn--quiet btn--small" onClick={back}>Back</button>
      </div>

      <header className="screen__header center">
        <h1><Icon name="award" size={28} /> You finished {moduleTitle}</h1>
        <p style={{ margin: '10px auto 0' }}>
          Every lesson in this module is done. Here is your certificate.
        </p>
      </header>

      <div className="certificate-wrap">
        <canvas ref={canvasRef} aria-label={`Certificate of completion for ${moduleTitle}`} />
        {downloadUrl ? (
          <a
            className="btn"
            href={downloadUrl}
            download={certificateFilename(name, moduleTitle)}
          >
            <Icon name="download" size={20} /> Download your certificate
          </a>
        ) : (
          <p style={{ color: 'var(--muted)' }}>
            Your certificate is shown above. You can save it with a screenshot.
          </p>
        )}
        <p style={{ color: 'var(--muted)', fontSize: 16, textAlign: 'center' }}>
          If the download button does nothing, take a screenshot instead. Some browsers block
          downloads from a page opened straight off your own computer.
        </p>
      </div>
    </div>
  )
}
