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

  const processCommand = (command: string): NavigationResult => {
    const trimmedCommand = command.trim();

    if (!trimmedCommand) {
      return {
        success: false,
        message: '',
        type: 'error'
      };
    }

    const lowerCommand = trimmedCommand.toLowerCase();

    if (isSpecialCommand(lowerCommand)) {
      if (lowerCommand === 'help' || lowerCommand === '?' || lowerCommand === 'aide') {
        return {
          success: true,
          message: `Commande ${trimmedCommand} reconnue\n\n${getCommandsList()}`,
          type: 'special'
        };
      } else if (lowerCommand === 'clear' || lowerCommand === 'cls' || lowerCommand === 'clean') {
        return {
          success: true,
          message: `Commande ${trimmedCommand} reconnue`,
          type: 'special'
        };
      }
    }

    const route = findRoute(trimmedCommand);

    if (route) {
      return {
        success: true,
        message: `Commande ${trimmedCommand} reconnue`,
        route,
        type: 'success'
      };
    }

    return {
      success: false,
      message: `Commande inconnue : réessayer`,
      type: 'error'
    };
  };

  const navigateToSection = (route: RouteConfig) => {
    if (route.path === '/works') {
      router.push('/works');
    } else {
      router.push({ path: '/', query: { section: route.section } });
    }
  };

  const handleCommand = (command: string): NavigationResult => {
    const result = processCommand(command);

    if (result.success && result.route) {
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