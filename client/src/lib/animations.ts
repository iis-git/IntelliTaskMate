import { Variants } from "framer-motion";

// Fade-in animation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Slide-up animation
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 }
  }
};

// Slide-in from right animation
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    x: 30,
    transition: { duration: 0.2 }
  }
};

// Staggered animation for lists
export const staggerItems = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Item animation for staggered lists
export const itemAnimation: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

// Animation for page transitions
export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Pulse animation for interactive elements
export const pulse: Variants = {
  hidden: { scale: 1 },
  visible: { 
    scale: [1, 1.05, 1],
    transition: { 
      duration: 1.5, 
      repeat: Infinity,
      repeatType: "loop"
    }
  }
};

// Pop-in animation for notifications
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 500,
      damping: 25
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2 }
  }
};
