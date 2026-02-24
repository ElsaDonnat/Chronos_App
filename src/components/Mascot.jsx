// Animated axolotl mascot — cute, simple, drawing-like style
import { useEffect, useState } from 'react';

export default function Mascot({ mood = 'happy', size = 80, className = '' }) {
    const [blink, setBlink] = useState(false);

    // Auto-blink every 3-5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 150);
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(interval);
    }, []);

    const animClass =
        mood === 'celebrating' ? 'mascot-bounce' :
            mood === 'sad' ? 'mascot-sad' :
                mood === 'thinking' ? 'mascot-wiggle' :
                    'mascot-float';

    const isCelebrating = mood === 'celebrating';
    const isThinking = mood === 'thinking';

    // Mouth path based on mood
    const mouthPaths = {
        happy: 'M -3 2 Q 0 5.5 3 2',
        thinking: 'M -2 3.5 L 2 3',
        celebrating: 'M -4 1.5 Q 0 7 4 1.5',
        sad: 'M -3 5 Q 0 2.5 3 5',
        surprised: 'M -2 2.5 Q 0 6 2 2.5',
    };

    return (
        <div className={`inline-flex items-center justify-center ${className} ${animClass}`}>
            <svg width={size} height={size} viewBox="-24 -26 48 52" fill="none">

                {/* === LEFT GILLS — 3 simple cute stalks === */}
                <g style={{ transformOrigin: '-8px -8px', animation: 'gillWave 2.5s ease-in-out infinite' }}>
                    <line x1="-9" y1="-10" x2="-19" y2="-20" stroke="#E8A0B4" strokeWidth="2.2" strokeLinecap="round" />
                    <circle cx="-19" cy="-20" r="1.5" fill="#E8A0B4" />
                    <line x1="-10" y1="-7" x2="-21" y2="-12" stroke="#D48098" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="-21" cy="-12" r="1.4" fill="#D48098" />
                    <line x1="-10" y1="-4" x2="-19" y2="-5" stroke="#F0B0C4" strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="-19" cy="-5" r="1.3" fill="#F0B0C4" />
                </g>

                {/* === RIGHT GILLS — 3 simple cute stalks === */}
                <g style={{ transformOrigin: '8px -8px', animation: 'gillWaveRight 2.5s ease-in-out infinite' }}>
                    <line x1="9" y1="-10" x2="19" y2="-20" stroke="#E8A0B4" strokeWidth="2.2" strokeLinecap="round" />
                    <circle cx="19" cy="-20" r="1.5" fill="#E8A0B4" />
                    <line x1="10" y1="-7" x2="21" y2="-12" stroke="#D48098" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="21" cy="-12" r="1.4" fill="#D48098" />
                    <line x1="10" y1="-4" x2="19" y2="-5" stroke="#F0B0C4" strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="19" cy="-5" r="1.3" fill="#F0B0C4" />
                </g>

                {/* Body — simple round blob */}
                <ellipse cx="0" cy="2" rx="13" ry="14" fill="#FFE0D0" />

                {/* Belly — lighter oval */}
                <ellipse cx="0" cy="5" rx="8" ry="8" fill="#FFF2EB" opacity="0.8" />

                {/* Couple cute spots */}
                <circle cx="-7" cy="-3" r="1.2" fill="#F5C4B0" opacity="0.4" />
                <circle cx="8" cy="0" r="1" fill="#F5C4B0" opacity="0.35" />

                {/* Left arm */}
                <ellipse cx="-12.5" cy="8" rx="3.2" ry="2" fill="#FFD6C4" transform="rotate(-12 -12.5 8)">
                    {isCelebrating && (
                        <animateTransform attributeName="transform" type="rotate" values="-12 -12.5 8;-28 -12.5 6;-12 -12.5 8" dur="0.6s" repeatCount="indefinite" additive="replace" />
                    )}
                </ellipse>

                {/* Right arm — holding hourglass */}
                <g>
                    <ellipse cx="12.5" cy="7" rx="3.5" ry="2" fill="#FFD6C4" transform="rotate(18 12.5 7)">
                        {isCelebrating && (
                            <animateTransform attributeName="transform" type="rotate" values="18 12.5 7;32 12.5 5;18 12.5 7" dur="0.6s" repeatCount="indefinite" additive="replace" />
                        )}
                    </ellipse>

                    {/* Mini hourglass */}
                    <g transform="translate(17, 4)">
                        <line x1="-2" y1="-3" x2="2" y2="-3" stroke="#8B4157" strokeWidth="0.8" strokeLinecap="round" />
                        <line x1="-2" y1="3" x2="2" y2="3" stroke="#8B4157" strokeWidth="0.8" strokeLinecap="round" />
                        <path d="M -1.5 -3 Q -1.5 -0.5 0 0 Q -1.5 0.5 -1.5 3" stroke="#8B4157" strokeWidth="0.6" fill="none" strokeLinecap="round" />
                        <path d="M 1.5 -3 Q 1.5 -0.5 0 0 Q 1.5 0.5 1.5 3" stroke="#8B4157" strokeWidth="0.6" fill="none" strokeLinecap="round" />
                        <circle cx="0" cy="2" r="0.6" fill="#A8596E" opacity="0.4" />
                    </g>
                </g>

                {/* Feet — simple ovals */}
                <ellipse cx="-5" cy="15.5" rx="3" ry="1.3" fill="#FFD0BA" transform="rotate(-8 -5 15.5)" />
                <ellipse cx="5" cy="15.5" rx="3" ry="1.3" fill="#FFD0BA" transform="rotate(8 5 15.5)" />

                {/* Tail — simple wagging line */}
                <path d="M 0 15 Q 5 18 3 21" stroke="#FFD0BA" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7">
                    <animate attributeName="d" values="M 0 15 Q 5 18 3 21;M 0 15 Q 8 17 6 20;M 0 15 Q 5 18 3 21" dur="2s" repeatCount="indefinite" />
                </path>

                {/* Eyes — big, cute, round */}
                <g>
                    {/* White base */}
                    <circle cx="-5" cy="-4" r="4" fill="white" />
                    <circle cx="5" cy="-4" r="4" fill="white" />

                    {/* Pupils — big & round, squish on blink */}
                    <ellipse cx="-5" cy="-4" rx="3" ry={blink ? 0.5 : 3} fill="#1C1917" style={{ transition: 'ry 0.08s ease' }}>
                        {isThinking && (
                            <animate attributeName="cx" values="-5;-4;-5;-6;-5" dur="3s" repeatCount="indefinite" />
                        )}
                    </ellipse>
                    <ellipse cx="5" cy="-4" rx="3" ry={blink ? 0.5 : 3} fill="#1C1917" style={{ transition: 'ry 0.08s ease' }}>
                        {isThinking && (
                            <animate attributeName="cx" values="5;6;5;4;5" dur="3s" repeatCount="indefinite" />
                        )}
                    </ellipse>

                    {/* Big shine dots */}
                    <circle cx="-3.8" cy="-5.5" r="1.4" fill="white" opacity="0.95" />
                    <circle cx="-5.8" cy="-3" r="0.6" fill="white" opacity="0.6" />
                    <circle cx="6.2" cy="-5.5" r="1.4" fill="white" opacity="0.95" />
                    <circle cx="4.2" cy="-3" r="0.6" fill="white" opacity="0.6" />

                    {/* Eyebrows for thinking/sad */}
                    {mood === 'thinking' && (
                        <>
                            <line x1="-7.5" y1="-8.5" x2="-2.5" y2="-8" stroke="#C4A090" strokeWidth="0.8" strokeLinecap="round" />
                            <line x1="2.5" y1="-8" x2="7.5" y2="-8.5" stroke="#C4A090" strokeWidth="0.8" strokeLinecap="round" />
                        </>
                    )}
                    {mood === 'sad' && (
                        <>
                            <line x1="-7.5" y1="-7.5" x2="-2.5" y2="-9" stroke="#C4A090" strokeWidth="0.8" strokeLinecap="round" />
                            <line x1="2.5" y1="-9" x2="7.5" y2="-7.5" stroke="#C4A090" strokeWidth="0.8" strokeLinecap="round" />
                        </>
                    )}
                </g>

                {/* Blush — two simple pink circles */}
                <circle cx="-9" cy="1" r="2.5" fill="#FFB5A0" opacity="0.35">
                    {isCelebrating && (
                        <animate attributeName="opacity" values="0.35;0.55;0.35" dur="1s" repeatCount="indefinite" />
                    )}
                </circle>
                <circle cx="9" cy="1" r="2.5" fill="#FFB5A0" opacity="0.35">
                    {isCelebrating && (
                        <animate attributeName="opacity" values="0.35;0.55;0.35" dur="1s" repeatCount="indefinite" />
                    )}
                </circle>

                {/* Little dot nostrils */}
                <circle cx="-1.2" cy="0.5" r="0.4" fill="#D4A898" opacity="0.35" />
                <circle cx="1.2" cy="0.5" r="0.4" fill="#D4A898" opacity="0.35" />

                {/* Mouth — simple curved line */}
                <path d={mouthPaths[mood] || mouthPaths.happy} stroke="#8B4157" strokeWidth="0.9" fill="none" strokeLinecap="round">
                    {isCelebrating && (
                        <animate attributeName="d" values="M -4 1.5 Q 0 7 4 1.5;M -4 2 Q 0 6 4 2;M -4 1.5 Q 0 7 4 1.5" dur="0.8s" repeatCount="indefinite" />
                    )}
                </path>
                {(mood === 'celebrating' || mood === 'surprised') && (
                    <ellipse cx="0" cy="4.5" rx="1.8" ry="1.2" fill="#E8A0B4" opacity="0.5" />
                )}

                {/* Sparkles when celebrating */}
                {isCelebrating && (
                    <g>
                        <g style={{ transformOrigin: '-16px -14px', animation: 'sparkleRotate 3s linear infinite' }}>
                            <text x="-18" y="-12" fontSize="5" fill="var(--color-burgundy)" opacity="0.7">✦</text>
                        </g>
                        <g style={{ transformOrigin: '16px -16px', animation: 'sparkleRotate 4s linear infinite reverse' }}>
                            <text x="14" y="-14" fontSize="4" fill="var(--color-warning)" opacity="0.6">✦</text>
                        </g>
                        <text x="-17" y="4" fontSize="4" fill="#E8A0B4" opacity="0">
                            <animate attributeName="opacity" values="0;0.8;0" dur="2s" repeatCount="indefinite" begin="0.3s" />
                            <animate attributeName="y" values="4;-4" dur="2s" repeatCount="indefinite" begin="0.3s" />
                        </text>
                    </g>
                )}

                {/* Question mark when thinking */}
                {isThinking && (
                    <text x="12" y="-14" fontSize="7" fill="var(--color-ink-muted)" fontWeight="bold" opacity="0">
                        <animate attributeName="opacity" values="0;0.5;0.5;0" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="y" values="-12;-16" dur="3s" repeatCount="indefinite" />
                    </text>
                )}

                {/* Sweat drop when sad */}
                {mood === 'sad' && (
                    <ellipse cx="8" cy="-6" rx="1" ry="1.5" fill="#A8D4E6" opacity="0">
                        <animate attributeName="opacity" values="0;0.6;0" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="cy" values="-6;-2" dur="3s" repeatCount="indefinite" />
                    </ellipse>
                )}
            </svg>
        </div>
    );
}
