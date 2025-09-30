export interface RouteConfig {
  path: string;
  section: string;
  label: string;
  description: string;
  aliases?: string[];
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    section: 'cv',
    label: 'CV',
    description: 'Curriculum Vitae complet',
    aliases: ['home', 'accueil']
  },
  {
    path: '/',
    section: 'experience',
    label: 'Expériences',
    description: 'Parcours professionnel',
    aliases: ['exp', 'experiences', 'expérience']
  },
  {
    path: '/',
    section: 'formation',
    label: 'Formation',
    description: 'Parcours académique',
    aliases: ['formations', 'etudes', 'études']
  },
  {
    path: '/',
    section: 'competences',
    label: 'Compétences',
    description: 'Skills techniques et soft skills',
    aliases: ['skills', 'competence', 'compétence', 'compétences']
  },
  {
    path: '/',
    section: 'projets',
    label: 'Projets',
    description: 'Portfolio de projets',
    aliases: ['projet', 'portfolio']
  },
  {
    path: '/works',
    section: 'works',
    label: 'Works',
    description: 'Réalisations professionnelles',
    aliases: ['work', 'realisations', 'réalisations']
  },
  {
    path: '/',
    section: 'contact',
    label: 'Contact',
    description: 'Informations de contact',
    aliases: ['contacts', 'coordonnees', 'coordonnées']
  }
];

export const specialCommands = [
  {
    command: 'help',
    label: 'Aide',
    description: 'Affiche la liste des commandes disponibles',
    aliases: ['?', 'aide', 'commandes']
  },
  {
    command: 'clear',
    label: 'Effacer',
    description: 'Efface l\'écran du terminal',
    aliases: ['cls', 'clean']
  }
];

/**
 * Trouve une route correspondant à la commande entrée
 * @param input - La commande entrée par l'utilisateur
 * @returns La configuration de route ou undefined
 */
export function findRoute(input: string): RouteConfig | undefined {
  const normalized = input.toLowerCase().trim();
  
  return routes.find(route => 
    route.section.toLowerCase() === normalized ||
    route.label.toLowerCase() === normalized ||
    route.aliases?.some(alias => alias.toLowerCase() === normalized)
  );
}

/**
 * Vérifie si la commande est une commande spéciale
 * @param input - La commande entrée par l'utilisateur
 * @returns true si c'est une commande spéciale
 */
export function isSpecialCommand(input: string): boolean {
  const normalized = input.toLowerCase().trim();
  
  return specialCommands.some(cmd => 
    cmd.command === normalized ||
    cmd.aliases?.includes(normalized)
  );
}

/**
 * Génère la liste des commandes disponibles
 * @returns String formaté avec toutes les commandes
 */
export function getCommandsList(): string {
  let output = '\n📋 Commandes disponibles:\n\n';
  
  routes.forEach(route => {
    output += `  ${route.section.padEnd(15)} - ${route.description}\n`;
  });
  
  output += '\n🛠️  Commandes spéciales:\n\n';
  
  specialCommands.forEach(cmd => {
    output += `  ${cmd.command.padEnd(15)} - ${cmd.description}\n`;
  });
  
  return output;
}