import type { CSSProperties } from 'react';

import { uiIconUrls, type UiIconName } from '@/lib/ui-icons';

interface Props {
  name: UiIconName;
  className?: string;
}

type IconStyle = CSSProperties & { '--ui-icon-source': string };

export default function ReactUiIcon({ name, className }: Props) {
  const style: IconStyle = { '--ui-icon-source': `url("${uiIconUrls[name]}")` };

  return (
    <span className={['ui-icon', className].filter(Boolean).join(' ')} style={style} aria-hidden />
  );
}
