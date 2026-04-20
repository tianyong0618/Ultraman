import { fireEvent, waitFor, screen } from '@testing-library/react'

export const startApp = async () => {
  fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
  await waitFor(() => {
    expect(screen.getByText('奥特Q')).toBeInTheDocument()
  })
}

export const clickNextPage = () => {
  fireEvent.click(screen.getByText('›'))
}