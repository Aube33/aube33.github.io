---
layout: default
title: PascalCTF - DNS e Pancetta
permalink: /ctf/pascalctf/dnsepancetta
---

# DNS e pancetta

## Statement
I've recently started studying a new cooking book and I think I've found the best recipe ever.
Do you wanna read it? Ask my dear friend DNS!

## Analyze
We have a file named `pancetta.pcapng` with these records
![pancetta.pcapng records from Wireshark](/assets/img/ctf/pascalctf/pascalctf-1.png "pancetta.pcapng records from Wireshark")

It's a classic case of **DNS exfiltration**. We need to process all packets with the DNS protocol, get their DNS queries and assemble them to get exfiltrated data.

## Exploitation
Using [Scapy](https://pypi.org/project/scapy/) python package we can extract our datas.
```py
from scapy.all import rdpcap, DNSQR

def extract_dns_requests(pcap_file):
    """
    Filter pcap file to extract only DNS
    """
    packets = rdpcap(pcap_file)

    dns_requests = []
    for packet in packets:
        if packet.haslayer(DNSQR):
            qname = packet[DNSQR].qname.decode('utf-8').strip('.')
            dns_requests.append(qname)

    return dns_requests

def sanitize_domains(domains_list):
    """
    Sanitize domains for output in bytes and remove duplicates
    """
    sanitized_domains = []
    seen = set()
    
    for domain in domains_list:
        segments = domain.split(".")
        if len(segments) > 2:
            domain = ".".join(segments[:-2])
        
        if domain not in seen:
            sanitized_domains.append(domain.strip())
            seen.add(domain)
    
    sanitized_domains = [domain.replace(".","") for domain in sanitized_domains]
    return sanitized_domains


def hex_to_text(hex_string):
    """
    Transform hexa DNS exfiltration to text
    """
    bytes_object = bytes.fromhex(hex_string)
    return bytes_object.decode("utf-8", errors="ignore")

def save_to(domains_list, mode="text", output="output_dns_exfiltration"):
    """
    Export results to file
    """

    if mode=="text":
        with open(output, "w") as f:
            f.write(hex_to_text("".join(domains_list)))
    if mode=="hex":
        with open(output, "w") as f:
            f.write("".join(domains_list))

if __name__ == "__main__":
    pcap_path = "pancetta.pcapng"

    print("[*] Extracting DNS requests...")
    dns_requests = extract_dns_requests(pcap_path)
    print(f"Total DNS requests found : {len(dns_requests)}")

    if len(dns_requests) > 0:
        print(f"\n[!] Total domains found : {len(dns_requests)}")

        domains = sanitize_domains(dns_requests)
        save_to(domains, "hex")
    else:
        print("\nNo suspicious domain found.")
```

After executing python code above we get our file `output_dns_exfiltration`:
```
attackercom4c6f72656d20697073756d...
```

Remove `attackercom` from the beginning and pass file content to [Cyberchef](https://gchq.github.io/CyberChef) with **From Hex** filter.

Result:
```
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lobortis id magna a vulputate. Proin id euismod nibh. Morbi sodales arcu a ex consectetur, ut gravida sapien facilisis. Proin porttitor tellus iaculis pretium porttitor. Nullam vel est ac est dictum sagittis id ut sapien. Aliquam convallis ipsum sapien, sed molestie quam laoreet eget. Cras velit augue, mollis sed imperdiet sed, varius in purus. Aliquam quis fermentum elit. Integer vulputate vestibulum maximus. Fusce consectetur mattis dui sed laoreet. Aliquam tristique justo in eros ullamcorper, at finibus ante hendrerit.
Aliquam id porta ex, in malesuada metus. Suspendisse quam purus, sodales quis imperdiet hendrerit, dapibus ac augue. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam interdum id turpis ac blandit. Vivamus sed felis quis lacus sodales semper ac id sapien. Integer ultricies tempor vehicula. Phasellus tincidunt aliquam lectus, a tempor odio varius vitae.
Vestibulum vel consequat mi. Duis malesuada vitae lacus vel aliquam. Maecenas erat odio, lobortis nec ipsum non, porta iaculis nisl. Ut eu erat quis dolor dapibus dapibus. Vestibulum scelerisque suscipit maximus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam sollicitudin luctus pulvinar. Phasellus consante ullamcorper massa pretium, quis semper sem porttitor. Ut non vehicula justo, sit amet ornare tortor.
Aenean in ante a nisl scelerisque interdum vitae quis sem. Nulla facilisi. Nulla ut lacus sagittis, tristique dolor vitae, imperdiet leo. Morbi venenatis massa sit amet diam consequat varius. Aenean quis venenatis massa. Quisque ac sagittis velit. Quisque ultrices sodales metus, eu mattis sapien luctus commodo. Praesent sapien ipsum, ultrices non dolor et, ornare blandit justo. Curabitur iaculis lectus sit amet nibh commodo consequat. Donec mollis risus a neque malesuada, eu dignissim massa posuere. Praesent suscipit finibus turpis. Praesent nibh orci, dapibus eu augue eget, condimentum vehicula justo. Etiam ultrices et metus quis cursus. Pellentesque odio risus, ornare ut mi in, pulvinar tincidunt ante. Sed luctus auctor dignissim. Nunc ultrices, massa eu facilisis congue, erat lectus facilisis felis, eu sagittis diam sem ut tellus.
Cras auctor sem libero, id bibendum lacus aliquam sit amet. Sed vel egestas urna. Etiam feugiat, felis sed fringilla blandit, augue tortor sagittis neque, at eleifend mauris tortor a purus. Vivamus vitae tristique justo. In volutpat nulla ac ipsum hendrerit, a ull enim dapibus. C nulla diam, bibendum sed libero et, mattis pharetra eros. Aenean lobortis, nibh ac tincidunt blandit, sapien nisi ultrices quam, nec rhoncus nibh diam vel magna. Donec quis orci eget leo mattis lacinia. Phasellus blandit nibh suscipit tortor commodo, sit amet mattis magna sagittis. Vestibulum aibus orci luctus et ultrices posuere cubilia curae; Nunc maximus mauris magna. Pellentesque efficitur pellentesque metuset tristique orci consectetur id. Proin t turpis et feugiat laoreet. Quisque in mattis elit. Duis laoreet fringilla neque, sed blandit lacus pretium id. 
Lol you now know all about lorem ipsum pascalCTF{DNS_b34coning_4ll_over_the_place}
```

Flag: **pascalCTF{DNS_b34coning_4ll_over_the_place}**

## How does it work ?
DNS Exfiltration is an attack used to exfiltrate datas using DNS protocol with DNS query.
Firewalls and security systems generally allowed DNS trafic, hidden data has a chance to leave the target network.<br>
One big limitation of using DNS to transfer data is that the DNS message length is limited to 255 bytes.