import React from 'react';
import sbpSvg from "../../assets/sbp_icon.svg";
import cardSvg from "../../assets/bank-card.svg";
import type {DeliveryAddress} from "./DeliveryForm.tsx";
import BackButton from "../Ui/BackButton.tsx";


type PaymentFormProps = {
    addr: DeliveryAddress;
    onSubmit?: (addr: DeliveryAddress) => Promise<void> | void;
    submitLabel?: string;
    onBack?: () => void;
};

const PaymentForm: React.FC<PaymentFormProps> = ({
                                                     addr,
                                                     onSubmit,
                                                     submitLabel = "Оплатить",
                                                     onBack,
                                                 }) => {

    const handlePayment = async () => {
        await onSubmit?.(addr);
    };

    return (
        <div className="flex flex-col">
            <h3 className="text-3xl font-semibold my-6">Оплата</h3>

            <div className="flex flex-col gap-4">

                <button
                    type="button"
                    onClick={handlePayment}
                    className="btn__circle big__button"
                >
                    {submitLabel}
                </button>

                {onBack && (
                    <BackButton onBack={onBack}/>
                )}
            </div>
        </div>
    );
};

export default PaymentForm;