import React, { useState, useEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';

const FIRST_RENDER_TIMEOUT = 100;
const TRANSITION_SEC = 0.3;
const DISMISS_TIMEOUT = 400;

interface StyleProps {
  hidden: boolean;
  displayed: boolean;
}

const useStyles = createUseStyles({
  overlay: {
    display: (props: StyleProps) => (props.displayed ? 'flex' : 'none'),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 999,
    overflow: 'auto',
    opacity: (props: StyleProps) => (props.hidden ? 0 : 1),
    transition: `opacity ${TRANSITION_SEC}s`,
  },
});

interface Props<T> {
  onDismiss: (v: T | null) => void;
  ignoreOverlayClick?: boolean;
  children: (onDismiss: (v?: T) => void) => JSX.Element;
}

export function Modal<T = undefined>({
  onDismiss,
  children,
  ignoreOverlayClick,
}: Props<T>) {
  const [isHidden, setHidden] = useState(true);
  const [hasRenderedOnce, setRenderedOnce] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setHidden(false);
      setRenderedOnce(true);
    }, FIRST_RENDER_TIMEOUT);

    return () => clearTimeout(t);
  }, []);

  const [dismissValue, setDismissValue] = useState<T | null>(null);

  useEffect(() => {
    if (!hasRenderedOnce || !isHidden) return;

    const t = setTimeout(() => {
      onDismiss(dismissValue);
    }, DISMISS_TIMEOUT);

    return () => clearTimeout(t);
  }, [isHidden]);

  const handleDismiss = (v?: T) => {
    setHidden(true);
    setDismissValue(v || null);
  };

  const modalRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (ignoreOverlayClick) return;
    if (!modalRef.current) return;
    if (!modalRef.current.contains(ev.target as Node)) {
      handleDismiss();
    }
  };

  const styles = useStyles({ hidden: isHidden, displayed: true });

  return (
    <div onClick={handleOverlayClick} className={styles.overlay}>
      <div ref={modalRef}>{children(handleDismiss)}</div>
    </div>
  );
}

interface Props2 {
  isOpen: boolean;
}

export const Modal2: React.FC<Props2> = ({ isOpen, children }) => {
  const [hidden, setHidden] = useState(true);
  const [displayed, setDisplayed] = useState(false);

  useEffect(() => {
    if (isOpen && displayed === false) {
      setDisplayed(true);

      const t = setTimeout(() => {
        setHidden(false);
      }, FIRST_RENDER_TIMEOUT);

      return () => {
        clearTimeout(t);
        // setDisplayed(false);
        // setHidden(true);
      };
    } else {
      setHidden(true);

      const t = setTimeout(() => {
        setDisplayed(false);
      }, DISMISS_TIMEOUT);

      return () => {
        clearTimeout(t);
        // setDisplayed(true);
        // setHidden(false);
      };
    }
  }, [isOpen]);

  const styles = useStyles({ hidden, displayed });

  return <div className={styles.overlay}>{children}</div>;
};
