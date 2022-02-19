import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Moment from 'react-moment';

function Profile() {
    const username = useParams()?.username;

    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetch("/api/account/get-profile", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username})
        })
        .then(res => res.json())
        .then((data) => {
            setProfile(data)
        })
    }, [username])


    if (!profile) {
        return (<p>Loading...</p>)
    } else if (!profile.success) {
        return <p className="text-muted">This user does not exist!</p>
    } else {
        return (
            <>
                <h3>{profile.username}</h3>
                <p>Joined <Moment fromNow>{profile.createdAt}</Moment></p>
            </>
        )
    }
}

export default Profile;