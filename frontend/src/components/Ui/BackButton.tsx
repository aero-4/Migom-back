import React from "react";


type Props = {
    onBack?: () => void;
};

const BackButton: React.FC<Props> = ({onBack}) => {
    return (
        <div>
            <button
                type="button"
                onClick={onBack}
                className="btn__circle bg-gray-500"
            >
                Назад
            </button>
        </div>
    )
}

export default BackButton;