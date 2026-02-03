import type { ReactNode } from 'react';
import './Layout.css';

interface LayoutProps {
    sidebar: ReactNode;
    main: ReactNode;
    panel?: ReactNode;
}

export function Layout({ sidebar, main, panel }: LayoutProps) {
    return (
        <div className="layout">
            <aside className="layout__sidebar glass">{sidebar}</aside>
            <main className="layout__main">{main}</main>
            {panel && <aside className="layout__panel glass-panel">{panel}</aside>}
        </div>
    );
}
