export class Path {

  static join(...args: string[]): string {
    const components: string[] = [];

    if (args.length === 0) {
      return '';
    }

    const protocol = args[0];

    if (protocol.match(/^[^/:]+:\/*$/) && args.length > 1) {
      const first = args.shift();
      args[0] = first + args[0];
    }

    if (args[0].match(/^file:\/\/\//)) {
      args[0] = args[0].replace(/^([^/:]+):\/*/, '$1:///');
    } else {
      args[0] = args[0].replace(/^([^/:]+):\/*/, '$1://');
    }

    args.forEach((component, i) => {
      if (component === '') {
        return;
      }

      if (i > 0) {
        component = component.replace(/^[\/]+/, '');
      }


      if (i < args.length - 1) {
        component = component.replace(/[\/]+$/, '');
      } else {
        // For the last combine multiple slashes into one.
        component = component.replace(/[\/]+$/, '/');
      }
      components.push(component);
    });

    let url = components.join('/');

    url = url.replace(/\/(\?|&|#[^!])/g, '$1');

    const parts = url.split('?');
    url = parts.shift() + (parts.length > 0 ? '?' : '') + parts.join('&');
    return url;
  }
}
