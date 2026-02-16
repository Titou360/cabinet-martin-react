// Exemple d'utilisation du composant SocialBar dans le Header, avec des liens vers les réseaux sociaux du cabinet.
//  Les icônes sont animées au survol grâce à Motion, et les styles sont personnalisables via les props du composant.

// Centré, vertical, grandes icônes
// <SocialBar align="center" direction="vertical" iconSize="lg" />

// Aligné à droite, petites icônes, petit gap
// <SocialBar align="right" iconSize="sm" gap="sm" />

// Avec classes personnalisées
// <SocialBar align="center" className="mt-8 mb-4" />

// Configuration par défaut (comme l'original)
// <SocialBar />




import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

import { motion } from "motion/react";

type SocialBarProps = {
  align?: "left" | "center" | "right";
  direction?: "horizontal" | "vertical";
  iconSize?: "sm" | "md" | "lg";
  gap?: "sm" | "md" | "lg";
  className?: string;
};

const SocialBar = ({ 
  align = "left", 
  direction = "horizontal",
  iconSize = "md",
  gap = "md",
  className = ""
}: SocialBarProps) => {
  
  // Alignement
  const alignmentClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  // Direction
  const directionClasses = {
    horizontal: "flex-row",
    vertical: "flex-col",
  };

  // Tailles d'icônes
  const iconSizeClasses = {
    sm: "text-sm p-2",
    md: "text-lg p-3",
    lg: "text-xl p-4",
  };

  // Espacement
  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  return (
    <div 
      className={`
        flex items-center pt-2 text-white/55
        ${alignmentClasses[align]}
        ${directionClasses[direction]}
        ${gapClasses[gap]}
        ${className}
      `}
    >
      <motion.a
        className={`
          bg-slate-700/50 hover:bg-linear-to-br hover:from-[#f9f5ec] 
          hover:to-[#ae894a] rounded-xl transition-all group hover:text-[#1b2a47]
          ${iconSizeClasses[iconSize]}
        `}
        href="#"
        aria-label="Facebook"
        whileHover={{ scale: 1.1, y: -3 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaFacebookF />
      </motion.a>
      <motion.a
        className={`
          bg-slate-700/50 hover:bg-linear-to-br hover:from-[#f9f5ec] 
          hover:to-[#ae894a] rounded-xl transition-all group hover:text-[#1b2a47]
          ${iconSizeClasses[iconSize]}
        `}
        href="#"
        aria-label="Instagram"
        whileHover={{ scale: 1.1, y: -3 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaInstagram />
      </motion.a>
      <motion.a
        className={`
          bg-slate-700/50 hover:bg-linear-to-br hover:from-[#f9f5ec] 
          hover:to-[#ae894a] rounded-xl transition-all group hover:text-[#1b2a47]
          ${iconSizeClasses[iconSize]}
        `}
        href="#"
        aria-label="LinkedIn"
        whileHover={{ scale: 1.1, y: -3 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaLinkedinIn />
      </motion.a>
    </div>
  );
};

export default SocialBar;