import { useState, useEffect } from "react";
import { postByPostId, getOwned } from "../../api/awards";
import "./awards.css";

function Awards({ postId, awards, allAwardsData, onAwardGiven }) {
    const [giving, setGiving] = useState(false);
    const [ownedAwards, setOwnedAwards] = useState([]);

    useEffect(() => {
        async function loadOwnedAwards() {
            try {
                const data = await getOwned();
                setOwnedAwards(data.awards);
            } catch (error) {
                console.error("Failed to load owned awards:", error);
            }
        }

        loadOwnedAwards();
    }, []);

    async function giveAward(awardId) {
        try {
            await postByPostId(postId, awardId);

            setOwnedAwards((current) =>
                current.map((award) =>
                    award.awardId === awardId
                        ? { ...award, count: award.count - 1 }
                        : award
                ).filter((award) => award.count > 0)
            );
            onAwardGiven();
            setGiving(false);
        } catch (error) {
            console.error("Failed to give award:", error);
        }
    }

    const availableAwards = allAwardsData.filter((award) =>
        ownedAwards.some(
            (owned) => owned.awardId === award.id && owned.count > 0
        )
    );

    return (
        <div className="post-awards">
            {awards.map((award) => {
                const data = allAwardsData.find((a) => a.id === award.awardId);

                return (
                    <span
                        className={`post-award-${data?.rarity ?? "common"}`}
                        key={award.awardId}
                        title={data?.description ?? "Unknown award"}
                    >
                        {data?.title ?? "Unknown award"} {award.count}
                    </span>
                );
            })}

            <button
                type="button"
                onClick={() => setGiving((current) => !current)}
                disabled={availableAwards.length === 0}
            >
                Give award
            </button>

            {giving && (
                <div className="award-selector">
                    {availableAwards.map((award) => {
                        const owned = ownedAwards.find(
                            (item) => item.awardId === award.id
                        );

                        return (
                            <button
                                type="button"
                                key={award.id}
                                onClick={() => giveAward(award.id)}
                            >
                                {award.title} ({owned.count})
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Awards;