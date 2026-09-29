import { useEffect, useState } from "react";
import { roll, getStatus } from "../../api/gacha";

function Gacha() {
    const [status, setStatus] = useState(null);
    const [result, setResult] = useState(null);
    const [rolling, setRolling] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadStatus() {
            try {
                const data = await getStatus();
                setStatus(data);
            } catch (error) {
                setError(error);
            }
        }

        loadStatus();
    }, []);

    useEffect(() => {
        if (!status || status.canRoll) {
            return;
        }

        const interval = setInterval(() => {
            setStatus((current) => {
                if (!current) {
                    return current;
                }

                const msUntilNextRoll = Math.max(
                    0,
                    current.msUntilNextRoll - 1000
                );

                return {
                    ...current,
                    msUntilNextRoll,
                    canRoll: msUntilNextRoll <= 0,
                };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [status?.canRoll]);

    async function handleRoll() {
        if (!status?.canRoll || rolling) {
            return;
        }

        try {
            setRolling(true);
            setError(null);
            setResult(null);

            const data = await roll();

            setResult(data.award);

            const newStatus = await getStatus();
            setStatus(newStatus);
        } catch (error) {
            setError(error);
        } finally {
            setRolling(false);
        }
    }

    if (!status) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Failed to load gacha.</div>;
    }

    return (
        <main>
            <h1>Gacha</h1>

            <button
                type="button"
                onClick={handleRoll}
                disabled={!status.canRoll || rolling}
            >
                {rolling
                    ? "Rolling..."
                    : status.canRoll
                        ? "Roll"
                        : "Cooldown"}
            </button>

            {!status.canRoll && (
                <p>
                    Next roll in: {Math.ceil(status.msUntilNextRoll / 1000)}s
                </p>
            )}

            {result && (
                <div>
                    <h2>You got:</h2>
                    <p>{result.title}</p>
                    <p>{result.description}</p>
                </div>
            )}
        </main>
    );
}

export default Gacha;