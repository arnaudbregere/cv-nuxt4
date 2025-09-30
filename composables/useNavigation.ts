import { useRouter } from 'vue-router';
import { findRoute, isSpecialCommand, getCommandsList, type RouteConfig } from '~/config/routes';

interface NavigationResult {
  success: boolean;
  message: string;
  route?: RouteConfig;
  type: 'success' | 'error' | 'info' | 'special';
}

export function useNavigation() {
  const router = useRouter();

  /**
   * Traite une commande et retourne le résultat
   * @param command - La commande à traiter
   * @returns Résultat de la navigation
   */
  const processCommand = (command: string): NavigationResult => {
    const trimmedCommand = command.trim();

    // Commande vide
    if (!trimmedCommand) {
      return {
        success: false,
        message: '',
        type: 'error'
      };
    }

    const lowerCommand = trimmedCommand.toLowerCase();

    // Commande help
    if (isSpecialCommand(lowerCommand) && (lowerCommand === 'help' || lowerCommand === '?' || lowerCommand === 'aide')) {
      return {
        success: true,
        message: getCommandsList(),
        type: 'special'
      };
    }

    // Commande clear
    if (isSpecialCommand(lowerCommand) && (lowerCommand === 'clear' || lowerCommand === 'cls' || lowerCommand === 'clean')) {
      return {
        success: true,
        message: 'clear',
        type: 'special'
      };
    }

    // Recherche de route
    const route = findRoute(trimmedCommand);

    if (route) {
      return {
        success: true,
        message: `✅ Commande '${route.section}' reconnue - Navigation vers ${route.label}...`,
        route,
        type: 'success'
      };
    }

    // Commande non reconnue
    return {
      success: false,
      message: `❌ Erreur: Commande '${trimmedCommand}' non reconnue.\nTapez 'help' pour voir les commandes disponibles.`,
      type: 'error'
    };
  };

  /**
   * Navigue vers une section
   * @param route - La configuration de route
   */
  const navigateToSection = (route: RouteConfig) => {
    if (route.path === '/works') {
      router.push('/works');
    } else {
      router.push({ path: '/', query: { section: route.section } });
    }
  };

  /**
   * Gère la navigation complète à partir d'une commande
   * @param command - La commande à exécuter
   * @returns Résultat de la navigation
   */
  const handleCommand = (command: string): NavigationResult => {
    const result = processCommand(command);

    if (result.success && result.route) {
      // Petit délai pour l'animation avant la navigation
      setTimeout(() => {
        navigateToSection(result.route!);
      }, 300);
    }

    return result;
  };

  return {
    processCommand,
    navigateToSection,
    handleCommand
  };
}