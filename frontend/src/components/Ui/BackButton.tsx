import React from "react";
import backSvg from "../../assets/left.svg"

const BackButton: React.FC<Props> = ({ref}) => {
    return (
        <div>
            <button ref={ref} className="p-3 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2">
                <img src={backSvg}
                     alt="Вернуться"
                     className="w-8 h-8"/>
            </button>
        </div>
    )
}

export default BackButton;