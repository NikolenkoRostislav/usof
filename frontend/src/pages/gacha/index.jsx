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
        return (
            <main className="gacha-page gacha-loading">
                <div className="gacha-loader">
                    <div className="gacha-loader-ring" />
                    <span>LOADING SUMMONING SYSTEM</span>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="gacha-page">
                <div className="gacha-error">
                    <span className="gacha-error-icon">!</span>
                    <h1>SUMMONING FAILED</h1>
                    <p>Something went wrong while contacting the gacha.</p>
                </div>
            </main>
        );
    }

    const rarity = result?.rarity ?? "common";

    return (
        <main className="gacha-page">
            <div className="gacha-background">
                <div className="gacha-grid" />
                <div className="gacha-glow gacha-glow-one" />
                <div className="gacha-glow gacha-glow-two" />
                <div className="gacha-glow gacha-glow-three" />

                <div className="gacha-particles">
                    {Array.from({ length: 30 }).map((_, index) => (
                        <span key={index} />
                    ))}
                </div>
            </div>

            <section className="gacha-container">
                <header className="gacha-header">
                    <div className="gacha-header-line" />

                    <p className="gacha-eyebrow">
                        DAILY REWARD SYSTEM
                    </p>

                    <h1>
                        <span>AWARD</span>
                        <strong>GACHA</strong>
                    </h1>

                    <p className="gacha-subtitle">
                        Test your luck. Claim your reward.
                    </p>

                    <div className="gacha-header-line" />
                </header>

                <section className="gacha-machine">
                    <div className="gacha-ring gacha-ring-outer" />
                    <div className="gacha-ring gacha-ring-middle" />
                    <div className="gacha-ring gacha-ring-inner" />

                    <div className="gacha-orb">
                        <div className="gacha-orb-core" />
                        <div className="gacha-orb-shine" />
                    </div>

                    <div className="gacha-machine-label">
                        <span>✦</span>
                        <span>LUCK ENGINE</span>
                        <span>✦</span>
                    </div>

                    <div className="gacha-corners">
                        <span />
                        <span />
                        <span />
                        <span />
                    </div>
                </section>

                {result && (
                    <section
                        className={`gacha-result gacha-result-${rarity}`}
                    >
                        <div className="gacha-result-shine" />

                        <div className="gacha-result-label">
                            REWARD ACQUIRED
                        </div>

                        <div className="gacha-result-icon">
                            ✦
                        </div>

                        <h2>{result.title}</h2>

                        <div className="gacha-rarity">
                            {result.rarity ?? "COMMON"}
                        </div>

                        <p>{result.description}</p>
                    </section>
                )}

                <section className="gacha-controls">
                    {status.canRoll ? (
                        <p className="gacha-status ready">
                            <span />
                            SUMMONING AVAILABLE
                        </p>
                    ) : (
                        <div className="gacha-cooldown">
                            <span className="cooldown-label">
                                NEXT SUMMON
                            </span>

                            <strong>
                                {Math.ceil(
                                    status.msUntilNextRoll / 1000
                                )}
                            </strong>

                            <span className="cooldown-unit">
                                SECONDS
                            </span>
                        </div>
                    )}

                    <button
                        className={`gacha-roll-button ${rolling ? "rolling" : ""
                            }`}
                        type="button"
                        onClick={handleRoll}
                        disabled={!status.canRoll || rolling}
                    >
                        <span className="button-border" />
                        <span className="button-glow" />
                        <span className="button-content">
                            <span className="button-icon">
                                {rolling ? "✧" : "✦"}
                            </span>

                            <span>
                                {rolling
                                    ? "SUMMONING"
                                    : status.canRoll
                                        ? "ROLL"
                                        : "LOCKED"}
                            </span>
                        </span>
                    </button>

                    <p className="gacha-disclaimer">
                        ONE FREE ROLL PER COOLDOWN
                    </p>
                </section>
            </section>
        </main>
    );
}

export default Gacha;