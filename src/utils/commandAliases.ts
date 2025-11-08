// Command aliases mapping
export const commandAliases: Record<string, string> = {
  'help': 'ls',
  'list': 'ls',
  'commands': 'ls',
  '?': 'ls',

  'about': 'info',
  'me': 'info',
  'who': 'whoami',

  'gh': 'projects',
  'github': 'projects',
  'repos': 'projects',
  'portfolio': 'projects',

  'contact': 'links',
  'social': 'links',

  'cv': 'resume',

  'posts': 'blog',
  'articles': 'blog',
  'write': 'blog',
  'writing': 'blog',

  'nasa': 'space',
  'apod': 'space',

  'kitty': 'cat',
  'kitten': 'cat',

  'laugh': 'meme',
  'joke': 'meme',
  'funny': 'meme',

  'cls': 'clear',
  'clr': 'clear',
};

export const resolveAlias = (command: string): string => {
  return commandAliases[command.toLowerCase()] || command;
};

export const getAllAliases = (command: string): string[] => {
  return Object.entries(commandAliases)
    .filter(([_, target]) => target === command)
    .map(([alias]) => alias);
};
