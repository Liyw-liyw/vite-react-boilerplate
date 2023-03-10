import cn from 'classnames';
import React from 'react';

import styles from './index.module.less';

interface {{name}}Props {
  className?: string;
}

function {{pascalCase name}}(props: {{name}}Props) {
  const { className } = props;

  return (
    <div className={cn(styles.{{camelCase name}}, className)}>
      {{name}}
    </div>
  );
}

export default {{pascalCase name}};
