import cn from 'classnames';
import React, { ReactNode } from 'react';
import { Header } from './Header';

import styles from './Layout.module.less';

interface LayoutProps {
  className?: string;
  children: string | ReactNode;
}

export function Layout(props: LayoutProps) {
  const { className, children } = props;

  return (
    <div className={cn(styles.Layout, 'h-screen w-screen', className)}>
      <Header />
      <div className="container">{children}</div>
    </div>
  );
}
