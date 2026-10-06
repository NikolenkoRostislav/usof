import { useEffect, useState } from "react";
import { roll, getStatus } from "../../api/gacha";
import "./gacha.css";

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
            setStatus(current => {
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
        return (
            <main className="gacha-page gacha-loading">
                <p>Preparing the fountain...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="gacha-page gacha-error">
                <h1>Fountain Unavailable</h1>

                <p>
                    Something went wrong while contacting the fountain.
                </p>
            </main>
        );
    }

    const rarity = result?.rarity ?? "common";

    return (
        <main className="gacha-page">
            <div className="gacha-water-coins" aria-hidden="true">
                <span>✦</span>
                <span>●</span>
                <span>✦</span>
                <span>●</span>
                <span>✦</span>
                <span>●</span>
                <span>✦</span>
                <span>●</span>
                <span>✦</span>
                <span>●</span>
                <span>✦</span>
                <span>●</span>
                <span>✦</span>
                <span>●</span>
            </div>

            <section className="gacha-content">
                <header className="gacha-header">
                    <h1>
                        The Fountain
                        <span>of Fortune</span>
                    </h1>
                </header>

                <section className="gacha-controls">
                    {status.canRoll ? (
                        <button
                            className={`gacha-roll-button ${rolling ? "rolling" : ""}`}
                            type="button"
                            onClick={handleRoll}
                            disabled={rolling}
                        >
                            <span className="gacha-coin">
                                ✦
                            </span>

                            <strong>
                                {rolling ? "TAKING YOUR COIN" : "TAKE A COIN"}
                            </strong>
                        </button>
                    ) : (
                        <p className="gacha-cooldown">
                            {Math.ceil(status.msUntilNextRoll / 1000)} seconds
                        </p>
                    )}
                </section>

                {result && (
                    <section
                        className={`gacha-result gacha-result-${rarity}`}
                    >
                        <p className="gacha-result-label">
                            YOU FOUND A BLESSING
                        </p>

                        <div className="gacha-result-coin">
                            ✦
                        </div>

                        <h2>{result.title}</h2>

                        <span className="gacha-rarity">
                            {result.rarity ?? "COMMON"}
                        </span>

                        <p>{result.description}</p>
                    </section>
                )}
            </section>
        </main>
    );
}

export default Gacha;