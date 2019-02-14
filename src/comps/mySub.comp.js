import { createElement } from 'inferno-create-element';

export default function({ name, age }) {
  return (
    <span>
      My name is: {name} and my age is: {age}
    </span>
  );
}
