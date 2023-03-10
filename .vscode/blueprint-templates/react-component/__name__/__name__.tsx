import cn from 'classnames';
import React from 'react';

import styles from './{{name}}.module.less';

interface {{name}}Props {
  className?: string;
}

export function {{name}}(props: {{name}}Props) {
  const { className } = props;

  return <div className={cn(styles.{{name}}, className)}>{{name}}</div>;
}
