import React, {useState} from 'react';

function Profile() {
    const [myData, setMyData] = useState(
        {"birthday": "2025-05-03", "email": "example@email.com", "first_name": "Alexey", "last_name": "Pereira"}
    )


    return (
        <>
            <h1 className="title justify-start">
                Профиль
            </h1>
            <div className="card gap-9">
                <div className="flex flex-row gap-1">
                    <p>{myData.first_name}</p>
                    <p>{myData.last_name}</p>
                </div>
                <p>
                    {myData.birthday}
                </p>
                <p>{myData.email}</p>

                <div className="flex flex-row gap-2">
                    <button className="big__button bg-black/80 hover:opacity-90 active:opacity-80">Поменять пароль</button>
                    <button className="big__button">Удалить профиль</button>

                </div>

            </div>
        </>
    );
}

export default Profile;