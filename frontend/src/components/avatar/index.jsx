import { useEffect, useState } from "react";
import { getAvatarById } from "../../api/users";
import "./avatar.css";
import defaultAvatar from "../../assets/default-avatar.png";

function Avatar({ user }) {
    const [src, setSrc] = useState(null);

    useEffect(() => {
        if (!user) {
            setSrc(defaultAvatar);
            return;
        }

        let objectUrl;

        getAvatarById(user.id)
            .then((url) => {
                objectUrl = url;
                setSrc(url);
            })
            .catch(() => {
                setSrc(defaultAvatar);
            });

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [user]);

    if (!src) {
        return <span className="avatar-placeholder">?</span>;
    }

    return (
        <img
            className="avatar"
            src={src}
            alt={user ? `${user.login}'s avatar` : "Avatar"}
        />
    );
}

export default Avatar;