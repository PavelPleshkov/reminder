import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';
import { db } from '../data/db';
import { resetTestDatabase } from '../test/dbTestUtils';

async function setup() {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={['/journal']}>
      <App />
    </MemoryRouter>,
  );
  await waitFor(() => expect(screen.queryByText('Loading…')).not.toBeInTheDocument());
  return { user };
}

describe('create and save journal entry', () => {
  beforeEach(async () => {
    await resetTestDatabase();
    await db.meta.put({ key: 'hasSeeded', value: true });
  });

  it('saves a valid entry and shows it in the list', async () => {
    const { user } = await setup();

    await user.click(screen.getByRole('button', { name: /create entry/i }));
    const dialog = screen.getByRole('dialog');
    await user.clear(within(dialog).getByLabelText('Odometer (km)'));
    await user.type(within(dialog).getByLabelText('Odometer (km)'), '55000');
    await user.clear(within(dialog).getByLabelText('Description'));
    await user.type(within(dialog).getByLabelText('Description'), 'Engine oil change');
    await user.click(within(dialog).getByRole('button', { name: /^engine$/i }));
    await user.clear(within(dialog).getByLabelText('Target odometer (km)'));
    await user.type(within(dialog).getByLabelText('Target odometer (km)'), '60000');
    await user.click(within(dialog).getByRole('button', { name: /^save$/i }));

    await waitFor(() => {
      expect(screen.getByText('Engine oil change')).toBeInTheDocument();
      expect(screen.getByText(/55,000 km/)).toBeInTheDocument();
    });
  });

  it('cancel discards draft without persisting', async () => {
    const { user } = await setup();

    await user.click(screen.getByRole('button', { name: /create entry/i }));
    await user.type(screen.getByLabelText('Description'), 'Should not save');
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.queryByText('Should not save')).not.toBeInTheDocument();
    expect(screen.getByText('Create your first entry')).toBeInTheDocument();
  });

  it('prevents double save creating duplicate entries', async () => {
    const { user } = await setup();

    await user.click(screen.getByRole('button', { name: /create entry/i }));
    await user.type(screen.getByLabelText('Description'), 'Single entry test');
    await user.type(screen.getByLabelText('Target odometer (km)'), '65000');
    const saveBtn = screen.getByRole('button', { name: /^save$/i });
    await user.dblClick(saveBtn);

    await waitFor(() => {
      expect(screen.getAllByText('Single entry test')).toHaveLength(1);
    });
  });
});
