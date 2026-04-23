import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FileUpload from './FileUpload'
import '@testing-library/jest-dom'

// Mock loglevel
vi.mock('loglevel', () => ({
  default: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

describe('FileUpload', () => {
  const defaultProps = {
    label: 'Test File',
    accept: '.pdf,.txt',
    onFileSelect: vi.fn(),
    selectedFile: null,
    disabled: false,
    maxSizeMB: 10,
  }

  it('renders upload area', () => {
    render(<FileUpload {...defaultProps} />)
    expect(screen.getByText('Test File')).toBeInTheDocument()
    expect(screen.getByText('Click to upload or drag and drop')).toBeInTheDocument()
  })

  it('shows selected file', () => {
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    render(<FileUpload {...defaultProps} selectedFile={mockFile} />)
    expect(screen.getByText('test.pdf')).toBeInTheDocument()
  })

  it('calls onFileSelect when file is selected', () => {
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    const onFileSelect = vi.fn()
    render(<FileUpload {...defaultProps} onFileSelect={onFileSelect} />)

    const input = screen.getByDisplayValue('')
    fireEvent.change(input, { target: { files: [mockFile] } })

    expect(onFileSelect).toHaveBeenCalledWith(mockFile)
  })

  it('shows error for oversized file', () => {
    const largeFile = new File(['x'.repeat(1024 * 1024 * 15)], 'large.pdf', { type: 'application/pdf' })
    const onFileSelect = vi.fn()
    render(<FileUpload {...defaultProps} onFileSelect={onFileSelect} maxSizeMB={10} />)

    const input = screen.getByDisplayValue('')
    fireEvent.change(input, { target: { files: [largeFile] } })

    expect(screen.getByText(/File size exceeds 10MB limit/)).toBeInTheDocument()
    expect(onFileSelect).not.toHaveBeenCalled()
  })

  it('shows error for invalid file type', () => {
    const invalidFile = new File(['test'], 'test.exe', { type: 'application/x-msdownload' })
    const onFileSelect = vi.fn()
    render(<FileUpload {...defaultProps} onFileSelect={onFileSelect} />)

    const input = screen.getByDisplayValue('')
    fireEvent.change(input, { target: { files: [invalidFile] } })

    expect(screen.getByText(/Invalid file type/)).toBeInTheDocument()
    expect(onFileSelect).not.toHaveBeenCalled()
  })
})