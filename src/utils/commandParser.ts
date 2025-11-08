// Command chaining parser
export type ChainOperator = '&&' | '||' | ';' | '|';

export interface ParsedCommand {
  command: string;
  args: string[];
  operator?: ChainOperator;
}

export const parseCommandChain = (input: string): ParsedCommand[] => {
  const commands: ParsedCommand[] = [];
  const operators: ChainOperator[] = ['&&', '||', ';', '|'];

  let currentCommand = '';
  let i = 0;

  while (i < input.length) {
    // Check for operators
    let foundOperator: ChainOperator | undefined;

    for (const op of operators) {
      if (input.slice(i, i + op.length) === op) {
        foundOperator = op;
        break;
      }
    }

    if (foundOperator) {
      // Push current command
      if (currentCommand.trim()) {
        const parts = currentCommand.trim().split(/\s+/);
        commands.push({
          command: parts[0],
          args: parts.slice(1),
          operator: foundOperator,
        });
      }

      currentCommand = '';
      i += foundOperator.length;
    } else {
      currentCommand += input[i];
      i++;
    }
  }

  // Push last command
  if (currentCommand.trim()) {
    const parts = currentCommand.trim().split(/\s+/);
    commands.push({
      command: parts[0],
      args: parts.slice(1),
    });
  }

  return commands;
};

// Filter command output based on grep-like pattern
export const grepFilter = (text: string, pattern: string): string => {
  try {
    const regex = new RegExp(pattern, 'gi');
    const lines = text.split('\n');
    return lines.filter(line => regex.test(line)).join('\n');
  } catch (error) {
    return `grep: Invalid pattern: ${pattern}`;
  }
};
