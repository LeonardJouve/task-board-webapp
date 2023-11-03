import React, {useState} from "react";
import {useFloating, useTransitionStyles, useInteractions, autoUpdate, shift, flip, useHover, useClick, useDismiss, safePolygon, type Placement} from "@floating-ui/react";

type Item = {
    text: string;
    leftDecorator?: string;
    rightDecorator?: string;
    isSelected?: boolean;
    isDangerous?: boolean;
    onPress?: () => void;
};

export enum MenuTrigger {
    CLICK,
    HOVER,
    DISMISS,
}

type Props = {
    button: React.JSX.Element;
    name: string;
    items: Item[];
    triggers?: MenuTrigger[];
    placement?: Placement;
    className?: string;
};

const Menu: React.FC<Props> = ({button, name, items, triggers = [MenuTrigger.HOVER], placement = "right-start", className = ""}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const {refs, floatingStyles, context} = useFloating({
        placement,
        open: isOpen,
        middleware: [
            shift(),
            flip({fallbackPlacements: ["right-start", "left-start", "bottom-start", "top-start", placement]}),
        ],
        onOpenChange: setIsOpen,
        whileElementsMounted: autoUpdate,
    });

    const {isMounted, styles} = useTransitionStyles(context, {duration: 200});

    const hover = useHover(context, {
        enabled: triggers.includes(MenuTrigger.HOVER),
        handleClose: safePolygon(),
    });

    const click = useClick(context, {enabled: triggers.includes(MenuTrigger.CLICK)});

    const dismiss = useDismiss(context, {enabled: triggers.includes(MenuTrigger.DISMISS)});

    const {getReferenceProps, getFloatingProps} = useInteractions([
        hover,
        click,
        dismiss,
    ]);


    const Button = React.cloneElement(button, {
        ref: refs.setReference,
        ...getReferenceProps(),
    });

    return (
        <>
            {Button}
            {isMounted && (
                <ul
                    ref={refs.setFloating}
                    className={`rounded py-2 border-[1px] background-4 border-color-1 whitespace-nowrap z-10 ${className}`}
                    style={{
                        ...floatingStyles,
                        ...styles,
                    }}
                    {...getFloatingProps()}
                >
                    {items.map(({text, leftDecorator, rightDecorator, isSelected, isDangerous, onPress}, i) => (
                        <li
                            key={`menu-${name}-${i}`}
                            className={`flex items-center px-2 py-1 hover:background-3 cursor-pointer ${isDangerous ? "color-dangerous" : ""}`}
                            onClick={onPress}
                        >
                            {leftDecorator && <i className={`icon-${leftDecorator}`}/>}
                            <span className="overflow-hidden text-ellipsis ">
                                {text}
                            </span>
                            <i className={`flex mr-0 ml-auto icon-${isSelected ? "check" : rightDecorator ?? "empty"}`}/>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default Menu;
