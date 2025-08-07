import { useEffect, useRef, type FC, type PropsWithChildren } from "react";
import { getComponentStyle, type TypeCommonProps } from ".";

type Props = PropsWithChildren & TypeCommonProps;
const Component: FC<Props> = ({ children, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const observer = new MutationObserver(() => {
      target.scrollTop = target.scrollHeight;
    });

    observer.observe(target, {
      childList: true,
      subtree: true,
    });

    // Scroll initially in case there’s already content
    target.scrollTop = target.scrollHeight;

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="ui-messages" style={getComponentStyle(props)}>
      {children}
    </section>
  );
};
Component.displayName = "UiMessages";
export default Component;
