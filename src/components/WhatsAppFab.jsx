import { waLink, GENERIC_MESSAGE } from '../utils/whatsapp'

export default function WhatsAppFab() {
  return (
    <a
      href={waLink(GENERIC_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      className="safe-bottom fixed left-4 right-4 z-50 flex items-center justify-center gap-2.5 rounded-2xl border border-white/15 px-5 py-4 text-[15px] font-extrabold text-white shadow-[0_10px_30px_rgba(230,81,0,0.45),0_2px_8px_rgba(0,0,0,0.4)] transition active:scale-[0.97] sm:mx-auto sm:max-w-[608px]"
      style={{ background: 'linear-gradient(135deg, #FF7A29, #D32F2F)' }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 flex-none">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.47 3.47 1.29 4.93L2 22l5.29-1.38a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.92C21.96 6.45 17.5 2 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.14.82.84-3.06-.2-.32a8.2 8.2 0 0 1-1.26-4.33c0-4.54 3.7-8.24 8.26-8.24 2.2 0 4.28.86 5.84 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.25 8.24Zm4.53-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.25-.65.81-.8.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.12-.14.16-.25.24-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.22.89 2.4 1.02 2.57.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28Z" />
      </svg>
      <span>Pedir o Consultar por WhatsApp</span>
    </a>
  )
}
