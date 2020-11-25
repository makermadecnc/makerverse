using System.IO.Ports;

namespace OpenWorkEngine.OpenController.Controller.Messages {
  public class SerialPortOptions : ISerialPortOptions {
    public int BaudRate { get; set; }

    public string? Parity { get; set; }

    public int? DataBits { get; set; }

    public int? StopBits { get; set; }

    public string? Handshake { get; set; }

    public int? ReadBufferSize { get; set; }

    public int? WriteBufferSize { get; set; }

    public bool? RtsEnable { get; set; }

    public int? ReadTimeout { get; set; }

    public int? WriteTimeout { get; set; }
  }
}
