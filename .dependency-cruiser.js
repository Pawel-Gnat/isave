/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'warn',
      comment:
        'Circular dependencies make modules harder to reason about and test in isolation.',
      from: {},
      to: { circular: true },
    },
    {
      name: 'types-not-importing-up',
      comment:
        'types/ should be a leaf layer — no imports from app, components, actions, hooks.',
      severity: 'warn',
      from: { path: '^types/' },
      to: {
        path: '^(app|components|actions|hooks|contexts|reducers|pages)/',
      },
    },
    {
      name: 'utils-not-importing-ui',
      comment: 'utils/ should stay free of React UI imports.',
      severity: 'warn',
      from: { path: '^utils/' },
      to: { path: '^components/' },
    },
    {
      name: 'actions-not-importing-components',
      comment: 'Server actions should not depend on React components.',
      severity: 'warn',
      from: { path: '^actions/' },
      to: { path: '^components/' },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      mainFields: ['module', 'main', 'types', 'typings'],
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/[^/]+',
      },
    },
  },
};
