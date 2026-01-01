
import React, { useEffect, useRef } from 'react';

/**
 * NEURAL BACKGROUND (ANTIGRAVITY V3)
 * A living network of synapses that reacts to the mouse.
 * Creates the "Bio-Digital" atmosphere.
 */

export const NeuralBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // Nodes (Neurons)
        const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
        const NODE_COUNT = 80;
        const CONNECTION_DISTANCE = 150;

        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(5, 5, 5, 1)';
            ctx.fillRect(0, 0, width, height);

            // Draw Connections
            ctx.strokeStyle = 'rgba(34, 197, 94, 0.15)'; // Green Neon Dim
            ctx.lineWidth = 1;

            for (let i = 0; i < nodes.length; i++) {
                const nodeA = nodes[i];

                // Updates position
                nodeA.x += nodeA.vx;
                nodeA.y += nodeA.vy;

                // Bounce off walls
                if (nodeA.x < 0 || nodeA.x > width) nodeA.vx *= -1;
                if (nodeA.y < 0 || nodeA.y > height) nodeA.vy *= -1;

                // Draw Node
                ctx.beginPath();
                ctx.arc(nodeA.x, nodeA.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(34, 197, 94, 0.5)';
                ctx.fill();

                // Connect nearest neighbors
                for (let j = i + 1; j < nodes.length; j++) {
                    const nodeB = nodes[j];
                    const dx = nodeA.x - nodeB.x;
                    const dy = nodeA.y - nodeB.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < CONNECTION_DISTANCE) {
                        ctx.beginPath();
                        ctx.moveTo(nodeA.x, nodeA.y);
                        ctx.lineTo(nodeB.x, nodeB.y);
                        ctx.globalAlpha = 1 - (dist / CONNECTION_DISTANCE);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen"
        />
    );
};
