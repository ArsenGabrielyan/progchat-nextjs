import { ReactNode } from "react"

interface ContextMenuProps{
     top: number,
     left: number,
     children: ReactNode
}

export default function ContextMenu({top,left,children}: ContextMenuProps){
     return <div className="contextMenu" style={{top: `${top}px`, left: `${left}px`}}>{children}</div>
}