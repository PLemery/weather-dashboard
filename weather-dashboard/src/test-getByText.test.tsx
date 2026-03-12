import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

function Comp() {
  return (
    <div>
      <span>55%</span>
      <span>14 km/h</span>
      <span>UV 5</span>
    </div>
  )
}

describe('getByText test', () => {
  it('finds unique 5', () => {
    render(<Comp />)
    expect(screen.getByText(/UV 5/)).toBeInTheDocument()
  })
})
