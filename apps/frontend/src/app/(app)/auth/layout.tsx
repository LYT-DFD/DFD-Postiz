import { ReactNode } from 'react';
import Image from 'next/image';
import loadDynamic from 'next/dynamic';
import { MantineWrapper } from '@gitroom/react/helpers/mantine.wrapper';
import { Toaster } from '@gitroom/react/toaster/toaster';
import styles from './auth.module.css';

export const dynamic = 'force-dynamic';
const ReturnUrlComponent = loadDynamic(() => import('./return.url.component'));

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <MantineWrapper>
      <Toaster />
      <main className={`light ${styles.shell}`}>
        <ReturnUrlComponent />
        <section className={styles.card} aria-label="Account access">
          <Image className={styles.puppy} src="/dfd-puppy.png" alt="DFD puppy" width={64} height={64} priority />
          {children}
        </section>
        <footer className={styles.footer}>
          <a href="https://github.com/LYT-DFD/DFD-Postiz/tree/dfd-brand-v1"
             target="_blank" rel="noopener noreferrer">Source code</a>
          <span aria-hidden="true">·</span>
          <span>AGPL-3.0</span>
        </footer>
      </main>
    </MantineWrapper>
  );
}
