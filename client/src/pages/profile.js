import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Moment from 'react-moment';
import { Card, Button } from 'react-bootstrap';

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
            console.log(data)
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
                <hr />
                <h4 className="mt-4">Game History</h4>
                <p><span className="text-muted">{profile.summary.total} Total</span> | <span className="text-success">{profile.summary.wins} Wins</span> | <span className="text-danger">{profile.summary.losses} Losses</span> | <span className="text-info">{Math.round((profile.summary.wins / profile.summary.total) * 100) / 100} W/L</span></p>
                {profile.games.map(game => (
                <Card className="mb-2">
                    <Card.Body>
                        <Button href={`/online/${game.uuid}`} className="float-end">View</Button>
                        <h5><a className="text-secondary" href={`/profile/${game.players[0]}`}>{game.players[0]}</a> vs <a className="text-secondary" href={`/profile/${game.players[1]}`}>{game.players[1]}</a></h5>
                        <span><b>{game.result}</b> - <Moment className="text-muted">{game.started}</Moment></span>
                    </Card.Body>
                </Card>
                ))}
            </>
        )
    }
}

export default Profile;