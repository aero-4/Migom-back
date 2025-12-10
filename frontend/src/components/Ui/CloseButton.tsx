import closeSvg from "../../assets/close.svg";

function CloseButton({close}) {
    return (
        <button
            type="button"
            onClick={close}
            aria-label="Закрыть корзину"
            className="p-2 h-8 w-8 ml-auto rounded-md hover:bg-gray-100 focus:outline-none "
        >
            <img src={closeSvg} alt=""/>
        </button>
    );
}

export default CloseButton;