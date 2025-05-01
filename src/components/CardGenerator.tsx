import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Rect, Text, Group, Image } from "react-konva";
import {
	CardConfig,
	OverlayType,
	BorderColor,
	BorderGradients,
	defaultCardConfig,
} from "../utils/CardTypes";
import "../styles/CardGenerator.css";
type CardGeneratorProps = {
	cardConfig: CardConfig,
	cardId: string
};

const isBrowser = typeof window !== "undefined";

const CardGenerator: React.FC<CardGeneratorProps> = ({ cardConfig, cardId }) => {
	console.log(cardConfig.skillNames)
	// Constants from original implementation
	const cardWidth = 750;
	const cardHeight = 1050;
	const scaleFactor = 300 / 110;

	// State for card configuration
	const [currentOverlay, setCurrentOverlay] =
		useState<OverlayType>("holographic");
	const [currentBorderColor, setCurrentBorderColor] =
		useState<BorderColor>("GREEN");
	const [cardElementsLoaded, setCardElementsLoaded] =
		useState<boolean>(false);

	// Refs for animation and elements
	const overlayAnimationRef = useRef<any>(null);
	const stageRef = useRef<any>(null);
	const titleRef = useRef<any>(null);
	const hpValueRef = useRef<any>(null);
	const damageValueRef = useRef<any>(null);
	const critRateRef = useRef<any>(null);
	const descriptionRef = useRef<any>(null);
	const skillTextsRef = useRef<any[]>([]);
	const overlayGroupRef = useRef<any>(null);
	const imageRef = useRef<any>(null);

	// Layout dimensions based on border thickness
	const [dimensions, setDimensions] = useState({
		borderThickness: 12 * scaleFactor,
		outerRectX: 0,
		outerRectY: 0,
		outerRectWidth: cardWidth,
		outerRectHeight: cardHeight,
		innerRectX: 12 * scaleFactor,
		innerRectY: 12 * scaleFactor,
		innerRectWidth: cardWidth - 24 * scaleFactor,
		innerRectHeight: cardHeight - 24 * scaleFactor,
		clipGroupX: 12 * scaleFactor,
		clipGroupY: 12 * scaleFactor,
		clipGroupWidth: cardWidth - 24 * scaleFactor,
		clipGroupHeight: cardHeight - 24 * scaleFactor,
	});

	// Border gradient presets
	const borderGradients: BorderGradients = {
		RED: [0, "#ff0000", 0.5, "#ff6666", 1, "#990000"],
		GREEN: [0, "#2ecc40", 0.5, "#01ff70", 1, "#007f3f"],
		BLUE: [0, "#0066ff", 0.5, "#66a3ff", 1, "#003d99"],
		GOLD: [
			0,
			"#FFD700",
			0.2,
			"#F0E68C",
			0.4,
			"#B8860B",
			0.6,
			"#C0C0C0",
			0.8,
			"#DAA520",
			1,
			"#FFD700",
		],
	};

	// Skill positions - these won't change with configuration
	const skillPositions = [
		{ x: 100 * scaleFactor, y: cardHeight * 0.45 + 70 * scaleFactor },
		{ x: 60 * scaleFactor, y: cardHeight * 0.45 + 85 * scaleFactor },
		{
			x: cardWidth - 130 * scaleFactor,
			y: cardHeight * 0.45 + 85 * scaleFactor,
		},
		{ x: 60 * scaleFactor, y: cardHeight * 0.45 + 100 * scaleFactor },
		{
			x: cardWidth - 130 * scaleFactor,
			y: cardHeight * 0.45 + 100 * scaleFactor,
		},
		{ x: 60 * scaleFactor, y: cardHeight * 0.45 + 115 * scaleFactor },
		{
			x: cardWidth - 130 * scaleFactor,
			y: cardHeight * 0.45 + 115 * scaleFactor,
		},
	];

	// Previous border gradient for foil effect
	const [previousBorderGradient, setPreviousBorderGradient] = useState<Array<
		number | string
	> | null>(null);

	// Fetch real data on page load
	useEffect(() => {
		if (!cardElementsLoaded) return;
		applyConfiguration(cardConfig).then(async (applied) => {
			if (!applied) return;
			const base64Image = stageRef.current.toDataURL().toString();
			if (!base64Image) return console.log("Image not rendered");
			try {
				const res = await fetch(
					"http://localhost:3000/api/preview",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},

						body: JSON.stringify({
							base64Image,
							imageName: cardId,
						}),
					}
				);

				const data = await res.json();

				console.log("Image Saving:", data.message);
			} catch (error) {
				console.error("Save error:", error);
			}
		});
	}, [cardElementsLoaded]);
	// Add styles to document head for font loading
	useEffect(() => {
		// Add the font face styles to head
		const style = document.createElement("style");
		document.head.appendChild(style);

		// Initialize with default border thickness
		setBorderThickness(12 * scaleFactor);

		return () => {
			document.head.removeChild(style);
			if (overlayAnimationRef.current) {
				overlayAnimationRef.current.stop();
			}
		};
	}, [scaleFactor]);
	// Load image when component mounts
	useEffect(() => {
		if (isBrowser) {
			const imageObj = new window.Image();
			imageObj.crossOrigin = "Anonymous";
			imageObj.src = `http://localhost:5000/output/${cardConfig.imageSrc}`;

			imageObj.onload = () => {
				if (imageRef.current) {
					// Scale to fit height, just like in the original version
					const scale = dimensions.clipGroupHeight / imageObj.height;
					const drawHeight = dimensions.clipGroupHeight;
					const drawWidth = imageObj.width * scale;
					const imgX = (dimensions.clipGroupWidth - drawWidth) / 2;

					imageRef.current.image(imageObj);
					imageRef.current.width(drawWidth);
					imageRef.current.height(drawHeight);
					imageRef.current.x(imgX);
					imageRef.current.y(0); // Position at the top of the clipping area

					const layer = imageRef.current.getLayer();
					if (layer) layer.draw();
				}
				setCardElementsLoaded(true);
			};

			imageObj.onerror = () => {
				console.error("Failed to load image:", cardConfig.imageSrc);
				setCardElementsLoaded(true);
			};
		}
	}, [
		cardConfig.imageSrc,
		dimensions.clipGroupHeight,
		dimensions.clipGroupWidth,
	]);
	// Apply overlay effect when currentOverlay changes
	useEffect(() => {
		if (cardElementsLoaded && overlayGroupRef.current) {
			setOverlayEffect(currentOverlay);
		}
	}, [currentOverlay, cardElementsLoaded]);

	const configureCard = (
		config: Partial<CardConfig>
	): Promise<HTMLImageElement> => {
		// Merge provided config with defaults - only for properties that exist in defaults
		const mergedConfig: CardConfig = { ...defaultCardConfig };
		for (const key in config) {
			if (
				key in mergedConfig &&
				config[key as keyof CardConfig] !== undefined
			) {
				(mergedConfig as any)[key] = config[key as keyof CardConfig];
			}
		}

		// Update card title
		if (titleRef.current) {
			titleRef.current.text(mergedConfig.cardTitle);
		}

		// Update HP
		if (hpValueRef.current) {
			hpValueRef.current.text(mergedConfig.hpValue);
		}

		// Update damage value
		if (damageValueRef.current) {
			damageValueRef.current.text("Damage: " + mergedConfig.damageValue);
		}

		// Update crit rate
		if (critRateRef.current) {
			critRateRef.current.text(
				"Crit Rate: " + mergedConfig.critRateValue
			);
		}

		// Update description
		if (descriptionRef.current) {
			descriptionRef.current.text(mergedConfig.description);
		}

		// Update border color
		if (mergedConfig.borderColor) {
			setBorderGradient(mergedConfig.borderColor);
		}

		// Update overlay
		if (mergedConfig.overlay) {
			setCurrentOverlay(mergedConfig.overlay);
			setOverlayEffect(mergedConfig.overlay);
		}

		// Update image if provided and different
		const newImage = new window.Image();
		newImage.crossOrigin = "Anonymous";
		newImage.src = `http://localhost:5000/output/${mergedConfig.imageSrc}`;

		// Update skills
		// In React we'll recreate the skills array in the render function

		// Save the updated config

		return new Promise((resolve, reject) => {
			newImage.onload = () => {
				if (imageRef.current) {
					// Scale to fit height
					const scale = dimensions.clipGroupHeight / newImage.height;
					const drawHeight = dimensions.clipGroupHeight;
					const drawWidth = newImage.width * scale;
					const imgX = (dimensions.clipGroupWidth - drawWidth) / 2;

					imageRef.current.image(newImage);
					imageRef.current.width(drawWidth);
					imageRef.current.height(drawHeight);
					imageRef.current.x(imgX);

					const layer = imageRef.current.getLayer();
					if (layer) layer.draw();
					resolve(newImage);
				}
				// };

				newImage.onerror = () => {
					console.error(
						"Failed to load image:",
						mergedConfig.imageSrc
					);
					resolve(newImage);
				};
			};
		});
	};
	const applyConfiguration = (config: any): Promise<boolean> => {
		return new Promise((resolve, reject) => {
			try {

				if (!cardElementsLoaded) {
					console.log(
						"Card elements not yet loaded, saving configuration for later application"
					);
					resolve(false);
					return;
				}

				// Update card elements with new configuration
				configureCard(config).then(() => {
					// Also update the overlay and border settings from the parsed config
					if (config.overlay) {
						const overlayType =
							config.overlay.toLowerCase() as OverlayType;
						setCurrentOverlay(overlayType);
						setOverlayEffect(overlayType);
					}

					if (config.borderColor) {
						setBorderGradient(config.borderColor as BorderColor);
					}

					console.log("Configuration applied successfully:", config);
					resolve(true);
				});
			} catch (error) {
				console.error("Error applying configuration:", error);
				resolve(false);
			}
		});
	};
	const setOverlayEffect = (effectType: OverlayType) => {
		// If current overlay is foil and we're changing to something else, restore border color
		if (currentOverlay === "foil" && effectType !== "foil") {
			// If we previously stored a border gradient, restore it
			if (previousBorderGradient) {
				// Find the border color dropdown value that matches our stored gradient
				for (const option in borderGradients) {
					if (
						JSON.stringify(borderGradients[option]) ===
						JSON.stringify(previousBorderGradient)
					) {
						setCurrentBorderColor(option as BorderColor);
						break;
					}
				}

				setPreviousBorderGradient(null);
			}
		}

		// Remove existing overlay if any
		if (overlayGroupRef.current) {
			overlayGroupRef.current.destroyChildren();
			if (overlayAnimationRef.current) {
				overlayAnimationRef.current.stop();
				overlayAnimationRef.current = null;
			}
		}

		// If no effect is chosen, just return
		if (effectType === "none") {
			const layer = overlayGroupRef.current?.getLayer();
			if (layer) layer.draw();
			return;
		}

		// Apply the selected effect
		if (effectType === "holographic") {
			applyHoloEffect();
		} else if (effectType === "glitter") {
			applyGlitterEffect();
		} else if (effectType === "paper") {
			applyPaperEffect();
		} else if (effectType === "foil") {
			applyFoilEffect();
		}

		// Draw the layer
		const layer = overlayGroupRef.current?.getLayer();
		if (layer) layer.draw();
	};
	const applyFoilEffect = () => {
		if (!overlayGroupRef.current) return;

		const layer = overlayGroupRef.current.getLayer();

		// Base foil shine
		const foilBase = new window.Konva.Rect({
			x: 0,
			y: 0,
			width: cardWidth,
			height: cardHeight,
			fill: "rgba(255, 215, 0, 0.1)", // Gold tint
		});
		overlayGroupRef.current.add(foilBase);

		// Create metallic pattern with alternating gold and silver stripes
		const stripeCount = 150;
		const stripeWidth = Math.ceil(cardWidth / stripeCount) + 1;

		for (let i = 0; i < stripeCount; i++) {
			const x = i * stripeWidth;
			// Random metallic colors - mix of gold and silver for more metallic look
			const colors = [
				"rgba(255, 215, 0, 0.12)", // Gold
				"rgba(218, 165, 32, 0.12)", // Goldenrod
				"rgba(192, 192, 192, 0.12)", // Silver
				"rgba(230, 232, 250, 0.12)", // Light silver
			];
			const metalColor =
				colors[Math.floor(Math.random() * colors.length)];

			const stripe = new window.Konva.Rect({
				x: x,
				y: 0,
				width: stripeWidth,
				height: cardHeight,
				fill: metalColor,
				opacity: 0.1 + Math.random() * 0.15,
			});
			overlayGroupRef.current.add(stripe);
		}

		// Add metallic gradient overlay with more gold/silver color steps
		const metallicOverlay = new window.Konva.Rect({
			x: 0,
			y: 0,
			width: cardWidth,
			height: cardHeight,
			fillLinearGradientStartPoint: { x: 0, y: 0 },
			fillLinearGradientEndPoint: { x: cardWidth, y: cardHeight },
			fillLinearGradientColorStops: [
				0,
				"rgba(255, 215, 0, 0.25)", // Gold
				0.15,
				"rgba(192, 192, 192, 0.2)", // Silver
				0.3,
				"rgba(212, 175, 55, 0.22)", // Metallic gold
				0.45,
				"rgba(230, 232, 250, 0.2)", // Light silver
				0.6,
				"rgba(255, 215, 0, 0.25)", // Gold
				0.75,
				"rgba(192, 192, 192, 0.2)", // Silver
				0.9,
				"rgba(212, 175, 55, 0.22)", // Metallic gold
				1,
				"rgba(255, 215, 0, 0.25)", // Gold
			],
			opacity: 0.5,
		});
		overlayGroupRef.current.add(metallicOverlay);

		// Store the current border color if not already stored
		if (!previousBorderGradient) {
			setPreviousBorderGradient(borderGradients[currentBorderColor]);
		}

		// Override border color to gold
		setBorderGradient("GOLD");

		// Add shimmer animation that responds to time
		let angle = 0;
		if (overlayAnimationRef.current) {
			overlayAnimationRef.current.stop();
		}

		overlayAnimationRef.current = new window.Konva.Animation(
			(frame: any) => {
				angle += 0.015;
				const shiftX = Math.sin(angle) * cardWidth * 0.6;
				const shiftY = Math.cos(angle) * cardHeight * 0.3;

				metallicOverlay.fillLinearGradientStartPoint({
					x: cardWidth * 0.5 + shiftX,
					y: cardHeight * 0.3 + shiftY,
				});

				metallicOverlay.fillLinearGradientEndPoint({
					x: cardWidth * 0.5 - shiftX,
					y: cardHeight * 0.7 - shiftY,
				});
			},
			layer
		);

		overlayAnimationRef.current.start();
	};
	const setBorderThickness = (thickness: number) => {
		setDimensions({
			borderThickness: thickness,
			outerRectX: 0,
			outerRectY: 0,
			outerRectWidth: cardWidth,
			outerRectHeight: cardHeight,
			innerRectX: thickness,
			innerRectY: thickness,
			innerRectWidth: cardWidth - thickness * 2,
			innerRectHeight: cardHeight - thickness * 2,
			clipGroupX: thickness,
			clipGroupY: thickness,
			clipGroupWidth: cardWidth - thickness * 2,
			clipGroupHeight: cardHeight - thickness * 2,
		});
		return thickness;
	};
	const setBorderGradient = (gradientType: BorderColor) => {
		// Store the current gradient before changing
		if (gradientType === "GOLD" && currentBorderColor !== "GOLD") {
			setPreviousBorderGradient(borderGradients[currentBorderColor]);
		} else if (gradientType !== "GOLD") {
			setPreviousBorderGradient(null);
		}

		setCurrentBorderColor(gradientType);
	};
	const applyHoloEffect = () => {
		if (!overlayGroupRef.current) return;

		const layer = overlayGroupRef.current.getLayer();

		// Holographic rainbow gradient overlay
		const holoGradient = new window.Konva.Rect({
			x: 0,
			y: 0,
			width: cardWidth,
			height: cardHeight,
			fillLinearGradientStartPoint: { x: 0, y: 0 },
			fillLinearGradientEndPoint: { x: cardWidth, y: cardHeight },
			fillLinearGradientColorStops: [
				0,
				"rgba(255, 0, 255, 0.4)",
				0.2,
				"rgba(0, 255, 255, 0.4)",
				0.4,
				"rgba(255, 255, 0, 0.4)",
				0.6,
				"rgba(0, 255, 0, 0.4)",
				0.8,
				"rgba(0, 0, 255, 0.4)",
				1,
				"rgba(255, 0, 255, 0.4)",
			],
		});
		overlayGroupRef.current.add(holoGradient);

		// Add subtle movement effect
		let angle = 0;
		if (overlayAnimationRef.current) {
			overlayAnimationRef.current.stop();
		}

		overlayAnimationRef.current = new window.Konva.Animation(
			(frame: any) => {
				angle += 0.01;
				holoGradient.fillLinearGradientStartPoint({
					x: cardWidth * 0.5 + Math.sin(angle) * cardWidth * 0.5,
					y: cardHeight * 0.5 + Math.cos(angle) * cardHeight * 0.5,
				});
				holoGradient.fillLinearGradientEndPoint({
					x:
						cardWidth * 0.5 +
						Math.sin(angle + Math.PI) * cardWidth * 0.5,
					y:
						cardHeight * 0.5 +
						Math.cos(angle + Math.PI) * cardHeight * 0.5,
				});
			},
			layer
		);
		overlayAnimationRef.current.start();
	};
	const applyGlitterEffect = () => {
		if (!overlayGroupRef.current) return;

		const layer = overlayGroupRef.current.getLayer();

		// Create semi-transparent background
		const glitterBg = new window.Konva.Rect({
			x: 0,
			y: 0,
			width: cardWidth,
			height: cardHeight,
			fill: "rgba(255, 255, 255, 0.05)",
		});
		overlayGroupRef.current.add(glitterBg);

		// Add glitter particles
		const glitterCount = 300;
		const glitterParticles: any[] = [];

		// Generate random glitter particles
		for (let i = 0; i < glitterCount; i++) {
			const x = Math.random() * cardWidth;
			const y = Math.random() * cardHeight;
			const size = (Math.random() * 2 + 1) * scaleFactor;
			const opacity = Math.random() * 0.6 + 0.2;

			// Choose random glitter color (silver, gold, white)
			const colors = ["white", "#FFD700", "#C0C0C0"];
			const color = colors[Math.floor(Math.random() * colors.length)];

			const glitter = new window.Konva.Circle({
				x: x,
				y: y,
				radius: size,
				fill: color,
				opacity: opacity,
			});

			overlayGroupRef.current.add(glitter);
			glitterParticles.push(glitter);
		}

		// Add shimmer animation
		let frameCount = 0;
		if (overlayAnimationRef.current) {
			overlayAnimationRef.current.stop();
		}

		overlayAnimationRef.current = new window.Konva.Animation(
			(frame: any) => {
				frameCount++;
				// Only update a subset of particles each frame for performance
				if (frameCount % 5 === 0) {
					// Randomly change opacity of some particles to create shimmer effect
					for (let i = 0; i < 20; i++) {
						const randomIndex = Math.floor(
							Math.random() * glitterParticles.length
						);
						const particle = glitterParticles[randomIndex];

						if (Math.random() > 0.7) {
							particle.opacity(Math.random() * 0.6 + 0.2);
						}
					}
				}
			},
			layer
		);

		overlayAnimationRef.current.start();
	};
	const applyPaperEffect = () => {
		if (!overlayGroupRef.current) return;

		// Create noise pattern for paper texture
		const gridSize = 5 * scaleFactor;
		const noiseOpacity = 0.07;

		// Create a pattern of small shapes for paper texture
		for (let x = 0; x < cardWidth; x += gridSize) {
			for (let y = 0; y < cardHeight; y += gridSize) {
				// Random brightness variation
				const brightness = 220 + Math.floor(Math.random() * 35);
				const opacity = noiseOpacity * (0.5 + Math.random() * 0.5);

				// Paper grain rectangle
				const grain = new window.Konva.Rect({
					x: x,
					y: y,
					width: gridSize,
					height: gridSize,
					fill: `rgb(${brightness}, ${brightness}, ${brightness})`,
					opacity: opacity,
				});
				overlayGroupRef.current.add(grain);
			}
		}

		// Add subtle fiber lines
		for (let i = 0; i < 20; i++) {
			const y = Math.random() * cardHeight;
			const lineLength = 20 + Math.random() * 100;
			const startX = Math.random() * (cardWidth - lineLength);

			const fiber = new window.Konva.Line({
				points: [startX, y, startX + lineLength, y],
				stroke: "rgba(255, 255, 255, 0.3)",
				strokeWidth: 1,
				opacity: 0.1 + Math.random() * 0.1,
			});
			overlayGroupRef.current.add(fiber);
		}

		// Add paper overlay
		const paperOverlay = new window.Konva.Rect({
			x: 0,
			y: 0,
			width: cardWidth,
			height: cardHeight,
			fillLinearGradientStartPoint: { x: 0, y: 0 },
			fillLinearGradientEndPoint: { x: cardWidth, y: cardHeight },
			fillLinearGradientColorStops: [
				0,
				"rgba(250, 250, 250, 0.05)",
				0.5,
				"rgba(230, 230, 230, 0.05)",
				1,
				"rgba(250, 250, 250, 0.05)",
			],
		});
		overlayGroupRef.current.add(paperOverlay);
	};
	const clipFunc = (ctx: any) => {
		const cornerRadius = 16 * scaleFactor;
		ctx.beginPath();
		ctx.moveTo(cornerRadius, 0);
		ctx.lineTo(dimensions.clipGroupWidth - cornerRadius, 0);
		ctx.quadraticCurveTo(
			dimensions.clipGroupWidth,
			0,
			dimensions.clipGroupWidth,
			cornerRadius
		);
		ctx.lineTo(
			dimensions.clipGroupWidth,
			dimensions.clipGroupHeight - cornerRadius
		);
		ctx.quadraticCurveTo(
			dimensions.clipGroupWidth,
			dimensions.clipGroupHeight,
			dimensions.clipGroupWidth - cornerRadius,
			dimensions.clipGroupHeight
		);
		ctx.lineTo(cornerRadius, dimensions.clipGroupHeight);
		ctx.quadraticCurveTo(
			0,
			dimensions.clipGroupHeight,
			0,
			dimensions.clipGroupHeight - cornerRadius
		);
		ctx.lineTo(0, cornerRadius);
		ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
		ctx.closePath();
	};

	return (
		<div className="card-generator">
			<div id="canvas-container">
				<Stage width={cardWidth} height={cardHeight} ref={stageRef}>
					<Layer>
						{/* Outer rectangle (border) */}
						<Rect
							x={dimensions.outerRectX}
							y={dimensions.outerRectY}
							width={dimensions.outerRectWidth}
							height={dimensions.outerRectHeight}
							cornerRadius={14 * scaleFactor}
							fillLinearGradientStartPoint={{ x: 0, y: 0 }}
							fillLinearGradientEndPoint={{
								x: cardWidth,
								y: cardHeight,
							}}
							fillLinearGradientColorStops={
								borderGradients[currentBorderColor]
							}
						/>

						{/* Inner rectangle (white background) */}
						<Rect
							x={dimensions.innerRectX}
							y={dimensions.innerRectY}
							width={dimensions.innerRectWidth}
							height={dimensions.innerRectHeight}
							cornerRadius={16 * scaleFactor}
							fill="white"
						/>

						{/* Image with clipping */}
						<Group
							x={dimensions.clipGroupX}
							y={dimensions.clipGroupY}
							width={dimensions.clipGroupWidth}
							height={dimensions.clipGroupHeight}
							clipFunc={clipFunc}
						>
							{cardElementsLoaded && (
								<Image
									ref={imageRef}
									image={
										imageRef.current?.image() ||
										new window.Image()
									}
									width={dimensions.clipGroupWidth}
									height={dimensions.clipGroupHeight}
									y={0}
								/>
							)}
						</Group>

						{/* Overlay effects group */}
						<Group
							ref={overlayGroupRef}
							x={0}
							y={0}
							width={cardWidth}
							height={cardHeight}
							opacity={0.55}
						/>

						{/* Card Title */}
						<Text
							ref={titleRef}
							x={22 * scaleFactor}
							y={22 * scaleFactor}
							text={cardConfig.cardTitle}
							letterSpacing={-1.3 * scaleFactor}
							fontSize={22 * scaleFactor}
							fontFamily="CardTitleFont"
							fill="black"
							fontStyle="bold"
							shadowColor="white"
							stroke="white"
							strokeWidth={0.3 * scaleFactor}
							width={cardWidth * 0.7}
							align="left"
						/>

						{/* HP Label */}
						<Text
							x={cardWidth - 77 * scaleFactor}
							y={29 * scaleFactor}
							text="HP"
							fontSize={10 * scaleFactor}
							fontFamily="CardStatFont"
							fill="green"
							fontStyle="bold"
							shadowColor="white"
							shadowBlur={1 * scaleFactor}
							shadowOffset={{
								x: 1 * scaleFactor,
								y: 1 * scaleFactor,
							}}
						/>

						{/* HP Value */}
						<Text
							ref={hpValueRef}
							x={cardWidth - 60 * scaleFactor}
							y={23 * scaleFactor}
							text={cardConfig.hpValue}
							fontSize={18 * scaleFactor}
							fontFamily="CardStatFont"
							fill="green"
							fontStyle="bold"
							shadowColor="white"
							shadowBlur={0 * scaleFactor}
							shadowOffset={{
								x: 1 * scaleFactor,
								y: 1 * scaleFactor,
							}}
						/>

						{/* Skill Names */}
						{cardConfig.skillNames.map((skill, index) => {
							if (index < skillPositions.length) {
								const position = skillPositions[index];
								return (
									<Text
										key={`skill-${index}`}
										x={position.x}
										y={position.y}
										text={skill}
										fontSize={10 * scaleFactor}
										fontFamily="CardSkillFont"
										fill="white"
										shadowColor="black"
										shadowBlur={1 * scaleFactor}
										shadowOffset={{
											x: 1 * scaleFactor,
											y: 1 * scaleFactor,
										}}
									/>
								);
							}
							return null;
						})}

						{/* Damage Box */}
						<Rect
							x={18 * scaleFactor}
							y={cardHeight - 75 * scaleFactor}
							width={(cardWidth - 40 * scaleFactor) / 2}
							height={15 * scaleFactor}
							fill="white"
							cornerRadius={4 * scaleFactor}
							shadowColor="black"
							shadowBlur={2 * scaleFactor}
							shadowOffset={{ x: 0, y: 3 * scaleFactor }}
							shadowOpacity={0.8}
						/>

						{/* Damage Text */}
						<Text
							ref={damageValueRef}
							x={40 * scaleFactor}
							y={cardHeight - 75 * scaleFactor + 2 * scaleFactor}
							text={`Damage: ${cardConfig.damageValue}`}
							fontSize={12 * scaleFactor}
							fontFamily="CardStatFont"
							fill="blue"
						/>

						{/* Crit Rate Box */}
						<Rect
							x={
								cardWidth -
								18 * scaleFactor -
								(cardWidth - 40 * scaleFactor) / 2
							}
							y={cardHeight - 75 * scaleFactor}
							width={(cardWidth - 40 * scaleFactor) / 2}
							height={15 * scaleFactor}
							fill="white"
							cornerRadius={4 * scaleFactor}
							shadowColor="black"
							shadowBlur={2 * scaleFactor}
							shadowOffset={{ x: 0, y: 3 * scaleFactor }}
							shadowOpacity={0.8}
						/>

						{/* Crit Rate Text */}
						<Text
							ref={critRateRef}
							x={
								cardWidth -
								2 * scaleFactor -
								(cardWidth - 40 * scaleFactor) / 2
							}
							y={cardHeight - 75 * scaleFactor + 2 * scaleFactor}
							text={`Crit Rate: ${cardConfig.critRateValue}`}
							fontSize={12 * scaleFactor}
							fontFamily="CardStatFont"
							fill="red"
						/>

						{/* Description */}
						<Text
							ref={descriptionRef}
							x={18 * scaleFactor}
							y={cardHeight - 54 * scaleFactor}
							text={cardConfig.description}
							fontSize={7 * scaleFactor}
							fontFamily="CardDescFont"
							fill="white"
							width={cardWidth - 35 * scaleFactor}
							align="left"
							shadowColor="black"
							shadowBlur={1 * scaleFactor}
						/>
					</Layer>
				</Stage>
			</div>
		</div>
	);
};

export default CardGenerator;
