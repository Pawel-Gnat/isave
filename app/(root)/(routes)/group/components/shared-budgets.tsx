import { Budget } from './budget';

export const SharedBudgets = () => {
  return (
    <ul className="space-y-4">
      <li>
        <Budget title="Budget 1" href="/group/1" />
      </li>
      <li>
        <Budget title="Budget 2" href="/group/2" />
      </li>
      <li>
        <Budget title="Budget 3" href="/group/3" />
      </li>
      <li>
        <Budget title="Budget 4" href="/group/4" />
      </li>
      <li>
        <Budget title="Budget 5" href="/group/5" />
      </li>
    </ul>
  );
};
