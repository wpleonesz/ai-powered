declare module 'minimatch' {
  function minimatch(target: string, pattern: string, options?: any): boolean;

  namespace minimatch {
    function filter(
      pattern: string,
      options?: any,
    ): (target: string) => boolean;
    function makeRe(pattern: string, options?: any): RegExp;
    var Minimatch: MinimatchConstructor;

    interface MinimatchOptions {
      debug?: boolean;
      nobrace?: boolean;
      noglobstar?: boolean;
      dot?: boolean;
      noext?: boolean;
      nocase?: boolean;
      nonull?: boolean;
      matchBase?: boolean;
      nocomment?: boolean;
      nonegate?: boolean;
      flipNegate?: boolean;
    }

    interface MinimatchConstructor {
      new (pattern: string, options?: MinimatchOptions): MinimatchInstance;
    }

    interface MinimatchInstance {
      pattern: string;
      options: MinimatchOptions;
      match(name: string): boolean;
      makeRe(): RegExp;
    }
  }

  export = minimatch;
}
