import "./awards.css";

function Awards({ awards, allAwardsData }) {
    if (awards.length === 0) {
        return null;
    }

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
        </div>
    );
}

export default Awards;