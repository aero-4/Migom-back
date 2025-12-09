import closeSvg from "../../assets/close.svg";

function CloseButton({close}) {
    return (
        <button
            type="button"
            onClick={close}
            aria-label="Закрыть корзину"
            className="ml-auto p-6 rounded-md hover:bg-gray-100 focus:outline-none "
        >
            <img className="w-4 h-4" src={closeSvg} alt=""/>
        </button>
    );
}

export default CloseButton;