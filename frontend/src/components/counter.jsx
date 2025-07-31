import React from "react";

export default function Counter({ qtn, onQuantityChange }){
    let [count, setCount] = React.useState(qtn);

    React.useEffect(() => {
        setCount(qtn);
    }, [qtn]);

    const increment = () => {
        const newCount = count + 1;
        setCount(newCount);
        if (onQuantityChange) {
            onQuantityChange(newCount);
        }
    }

    const decrement = () => {
        if (count > 1) {
            const newCount = count - 1;
            setCount(newCount);
            if (onQuantityChange) {
                onQuantityChange(newCount);
            }
        } else if (count === 1) {
            // If quantity is 1 and user tries to decrement, remove the item
            if (onQuantityChange) {
                onQuantityChange(0);
            }
        }
    }

    return(
        <>
        <div className="qty-icons">
            <button onClick={() => decrement()} className="size-9 inline-flex items-center justify-center tracking-wide align-middle text-base text-center rounded-md bg-orange-500/5 hover:bg-orange-500 text-orange-500 hover:text-white minus">-</button>
            <input min="0" name="quantity" value={count} type="number" readOnly className="h-9 inline-flex items-center justify-center tracking-wide align-middle text-base text-center rounded-md bg-orange-500/5 hover:bg-orange-500 text-orange-500 hover:text-white pointer-events-none w-16 ps-4 quantity mx-1"/>
            <button onClick={() => increment()} className="size-9 inline-flex items-center justify-center tracking-wide align-middle text-base text-center rounded-md bg-orange-500/5 hover:bg-orange-500 text-orange-500 hover:text-white plus">+</button>
        </div>
        </>
    )
}