/**
 * Classic 90s mIRC Style Chat Command Handler
 * Intercepts messages starting with "/" and returns custom action responses
 */

export interface ChatCommandResult {
  isCommand: boolean;
  action?: 'clear' | 'slap' | 'roll' | 'help' | null;
  response?: string;
  shouldDeleteMessages?: boolean;
}

/**
 * Parses incoming chat message strings and detects mIRC-style commands
 * Supported commands: /slap, /roll, /clear, /help
 */
export function handleChatCommand(message: string): ChatCommandResult {
  const trimmedMessage = message.trim();
  
  if (!trimmedMessage.startsWith('/')) {
    return { isCommand: false };
  }

  const [command, ...args] = trimmedMessage.slice(1).toLowerCase().split(/\s+/);

  switch (command) {
    case 'slap': {
      const target = args[0] || 'someone';
      return {
        isCommand: true,
        action: 'slap',
        response: `* slaps ${target} around with a large trout! >:)`
      };
    }

    case 'roll': {
      const sides = parseInt(args[0]) || 100;
      const rollResult = Math.floor(Math.random() * sides) + 1;
      return {
        isCommand: true,
        action: 'roll',
        response: `* rolls a ${sides}-sided die and gets... ${rollResult}! 🎲`
      };
    }

    case 'clear': {
      return {
        isCommand: true,
        action: 'clear',
        response: '* Screen cleared.',
        shouldDeleteMessages: true,
      };
    }

    case 'help': {
      const helpText = `Available commands:
/slap [username] - Slap a user with a trout
/roll [number] - Roll a dice (default 100-sided)
/clear - Clear the message history
/help - Show this help message`;
      return {
        isCommand: true,
        action: 'help',
        response: helpText
      };
    }

    default: {
      return {
        isCommand: true,
        response: `* Unknown command: /${command}. Type /help for available commands.`
      };
    }
  }
}

/**
 * Checks if a message is a chat command
 */
export function isChatCommand(message: string): boolean {
  return message.trim().startsWith('/');
}

/**
 * Gets all available command names
 */
export function getAvailableCommands(): string[] {
  return ['slap', 'roll', 'clear', 'help'];
}
